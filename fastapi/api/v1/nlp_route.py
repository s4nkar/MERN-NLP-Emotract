from fastapi import APIRouter
from pydantic import BaseModel
from models.v2_models import *
from utils.emotion_sentiment import *
from typing import Dict
from fastapi.responses import JSONResponse

# Create a router for the routes
router = APIRouter()

class TextRequest(BaseModel):
    text: str

# dictionary of model functions
models = {
    "bert": bert_model,
    "roberta": roberta_model,
    "rf": rf_model,
    "lr": lr_model,
}

@router.post("/analyze/")
async def analyze_sentiment(request: TextRequest):
    text = request.text
    
    # Prepare a dictionary to store results
    results: Dict[str, Dict[str, str]] = {}

    try:
        # Loop over the models to get emotions and probabilities
        for model_name, model_func in models.items():
            emotion, probability = model_func(text)
            sentiment = emotion_sentiment_dataset2.get(emotion, "neutral")  # Default to "neutral" if emotion is not found
            
            # Store each model's result in the results dictionary
            results[model_name] = {
                "emotion": emotion,
                "probability": probability,
                "sentiment": sentiment,
            }

        print(results)
        # Return the response
        return JSONResponse(
            content={
                "data": results,
                "message": "Prediction of emotions and sentiments was successful",
            },
            status_code=200,
        )
    except Exception as err:
        # Handle exceptions 
        return JSONResponse(
            content={
                "data": {},
                "message": f"Error while processing the text: {str(err)}",
            },
            status_code=500,
        )
