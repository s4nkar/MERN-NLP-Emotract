from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from models import *
import logging

app = FastAPI()

# Request Body Schema
class TextRequest(BaseModel):
    text: str

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("uvicorn")

@app.get("/")
def read_root():
    logger.debug("Root endpoint is being accessed.")
    return {"message": "Hello World"}

@app.post("/analyze/")
async def analyze_sentiment(request: TextRequest):
    text = request.text

    data = [
        # BERT MODEL
        bert_model(text),
        
        # RoBERTa MODEL
        roberta_model(text),

        # LR MODEL
        lr_model(text),
        
        # RF MODEL
        rf_model(text)
    ]

    return JSONResponse(content={"data": data})


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, port=8000, reload=True)