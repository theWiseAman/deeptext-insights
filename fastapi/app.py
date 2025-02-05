from fastapi import FastAPI, APIRouter, HTTPException
from langchain.prompts import ChatPromptTemplate
from langchain_community.llms import Ollama
from langserve import add_routes
from dotenv import load_dotenv
from pydantic import BaseModel
from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification, AutoModelForCausalLM
from langchain_huggingface import HuggingFacePipeline
import os

class UserInput(BaseModel):
    userInput: str

class LlmScoreResponse(BaseModel):
    userInput: str
    llmResponse: str
    vectaraScore: float
    educationScore: float

load_dotenv()

os.environ["LANGSMITH_API_KEY"]= os.getenv("LANGSMITH_API_KEY")
os.environ["LANGSMITH_TRACING"] = os.getenv("LANGSMITH_TRACING")
os.environ["HF_HOME"] = os.getenv("HF_HOME")

app = FastAPI(
    title="LangChain Server",
    version="0.1.0",
    description="A simple LangChain API server"
)
router = APIRouter()


@app.get("/health")
def health_check():
    return {"status": "healthy"}

# prompt=ChatPromptTemplate.from_messages(
#     [
#         (
#             "system",
#             "You are an AI assistant who help users get correct information about a topic. Generate a brief summary about the topic asked by the user in at max 200 words."
#         ),
#         (
#             "user",
#             "Question:{question}"
#         )
#     ]
# )

# llmModel = Ollama(model='llama3')
# chain = prompt|llmModel

# add_routes(
#     app,
#     chain,
#     path="/api/v1/llmResponse",
# )

@router.post("/api/v1/llmScore")
async def get_score(body: UserInput, response_model=LlmScoreResponse):
    try:
        user_input = body.userInput

        gpt_tokenizer = AutoTokenizer.from_pretrained("openai-community/gpt2")
        gpt_model = AutoModelForCausalLM.from_pretrained("openai-community/gpt2")
        text_generation_pipeline = pipeline("text-generation", model=gpt_model, tokenizer=gpt_tokenizer, max_length=200, truncation=True)
        hf_pipeline = HuggingFacePipeline(pipeline=text_generation_pipeline)
        llmOutput: str = hf_pipeline.invoke(user_input)

        tokenizer = AutoTokenizer.from_pretrained("HuggingFaceTB/fineweb-edu-classifier")
        education_model = AutoModelForSequenceClassification.from_pretrained("HuggingFaceTB/fineweb-edu-classifier")
        inputs = tokenizer(llmOutput, return_tensors="pt", padding="longest", truncation=True)
        outputs = education_model(**inputs)
        logits = outputs.logits.squeeze(-1).float().detach().numpy()
        education_score = round(logits.item(), 3)

        pairs = [
            (user_input, llmOutput),
        ]
        vectara_model = AutoModelForSequenceClassification.from_pretrained('vectara/hallucination_evaluation_model', trust_remote_code=True)
        vectara_full_scores = vectara_model.predict(pairs)
        vectara_score = round(vectara_full_scores.item(), 3)

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
