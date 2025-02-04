import streamlit as st
import requests

def get_response(input_text):
    url = "http://localhost:8000/api/v1/llmResponse/invoke"
    response = requests.post(url, json={"input":{"question": input_text}})
    return response.json()["output"]

st.title("LangChain Client")
input_text = st.text_input("Enter your question here:")
if st.button("Submit"):
    st.write(get_response(input_text))
