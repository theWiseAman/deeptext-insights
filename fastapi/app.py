from fastapi import FastAPI, APIRouter, HTTPException
from langchain.prompts import ChatPromptTemplate
from langchain_community.llms import Ollama
from langserve import add_routes
from dotenv import load_dotenv
from pydantic import BaseModel
from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification, AutoModelForCausalLM
import os

class UserInput(BaseModel):
    userInput: str

class LlmScoreResponse(BaseModel):
    userInput: str
    llmResponse: str
    vectaraScore: float
    educationScore: float

load_dotenv()

os.environ["LANGSMITH_API_KEY"]=os.getenv("LANGSMITH_API_KEY")
os.environ["LANGSMITH_TRACING"] = os.getenv("LANGSMITH_TRACING")

app = FastAPI(
    title="LangChain Server",
    version="0.1.0",
    description="A simple LangChain API server"
)
router = APIRouter()

prompt=ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You are an AI assistant who help users get correct information about a topic. Generate a brief summary about the topic asked by the user in at max 200 words."
        ),
        (
            "user",
            "Question:{question}"
        )
    ]
)

llmModel = Ollama(model='llama3')
chain = prompt|llmModel

add_routes(
    app,
    chain,
    path="/api/v1/llmResponse",
)

@router.post("/api/v1/llmScore")
async def get_score(body: UserInput, response_model=LlmScoreResponse):
    try:
        user_input = body.userInput

        gpt_tokenizer = AutoTokenizer.from_pretrained("openai-community/gpt2")
        gpt_model = AutoModelForCausalLM.from_pretrained("openai-community/gpt2")
        llmOutput = pipeline("text-generation", model=gpt_model, tokenizer=gpt_tokenizer, max_new_tokens=200)(user_input)[0]['generated_text']

        tokenizer = AutoTokenizer.from_pretrained("HuggingFaceTB/fineweb-edu-classifier")
        education_model = AutoModelForSequenceClassification.from_pretrained("HuggingFaceTB/fineweb-edu-classifier")
        inputs = tokenizer(llmOutput, return_tensors="pt", padding="longest", truncation=True)
        outputs = education_model(**inputs)
        logits = outputs.logits.squeeze(-1).float().detach().numpy()
        education_score = round(logits.item(), 3)

        pairs = [
            (user_input, llmOutput),
        ]
        vectara_prompt = f"""
        Determine if the LLM response is consistent with the given user input? \n\n
        User Input: {user_input} \n\n
        LLM Response: {llmOutput}
        """
        print("Vectara Prompt: ", vectara_prompt)
        vectara_input_pairs = [prompt.format(text1=pair[0], text2=pair[1]) for pair in pairs]
        vectara_classifier = pipeline(
            "text-classification",
            model='vectara/hallucination_evaluation_model',
            tokenizer=AutoTokenizer.from_pretrained('google/flan-t5-base'),
            trust_remote_code=True
        )
        vectara_full_scores = vectara_classifier(vectara_input_pairs, top_k=None)
        vectara_simple_scores = [score_dict['score'] for score_for_both_labels in vectara_full_scores for score_dict in score_for_both_labels if score_dict['label'] == 'consistent']
        vectara_score = round(sum(vectara_simple_scores) / len(vectara_simple_scores), 3)
        print("Vectara: ", vectara_score)

        return {
            "userInput": user_input,
            "llmResponse": llmOutput,
            "vectaraScore": vectara_score,
            "educationScore": education_score
        }
    except Exception as e:
        print("Error: ", e)
        raise HTTPException(status_code=500, detail=str(e))

app.include_router(router)
