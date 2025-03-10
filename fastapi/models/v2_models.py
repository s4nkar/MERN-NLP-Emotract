from transformers import RobertaTokenizer, RobertaForSequenceClassification, BertForSequenceClassification, BertTokenizer
from utils.emotions_labels import emotions
import torch
import joblib
import os
import torch.nn.functional as F

# v2 models return emtions with predicted probabilities

# Get the absolute path of the current script
current_dir = os.path.dirname(os.path.abspath(__file__))  


def bert_model(text) -> str:
    print(os.path.join(current_dir, "bert/model"))
    bert_model = BertForSequenceClassification.from_pretrained(os.path.join(current_dir, "bert/model"))
    tokenizer = BertTokenizer.from_pretrained(os.path.join(current_dir, "bert/tokenizer"))

    bert_model.eval()  # Set model to evaluation mode

    # Move the model to GPU if it's not already on GPU
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    bert_model.to(device)

    # Tokenize the input text
    inputs = tokenizer(text, return_tensors="pt")

    # Move the inputs to the same device as the model (GPU)
    inputs = {key: value.to(device) for key, value in inputs.items()}

    # Pass the inputs through the model
    outputs = bert_model(**inputs)

    # Get the predicted label (highest logit value)
    logits = outputs.logits
    prediction = outputs.logits.argmax(dim=-1)
    label = prediction.item()

    # Calculate the predicted probability using softmax
    probabilities = F.softmax(logits, dim=-1)  # Convert logits to probabilities
    predicted_probability = probabilities[0][label].item()  # Get the probability of the predicted label

    return emotions[label], predicted_probability

def roberta_model(text) -> str:
    roberta_model = RobertaForSequenceClassification.from_pretrained(os.path.join(current_dir, 'roberta/model'))
    tokenizer = RobertaTokenizer.from_pretrained(os.path.join(current_dir, 'roberta/tokenizer'))

    # Set the model to evaluation mode
    roberta_model.eval()

    # Move the model to GPU if available
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    roberta_model.to(device)

    # Tokenize the input text
    inputs = tokenizer(text, return_tensors="pt")

    # Move the inputs to the same device as the model
    inputs = {key: value.to(device) for key, value in inputs.items()}

    # Pass the inputs through the model
    with torch.no_grad():  # No gradients needed for inference
        outputs = roberta_model(**inputs)

    # Get the predicted label (highest logit value)
    logits = outputs.logits
    prediction = outputs.logits.argmax(dim=-1)
    label = prediction.item()

    # Calculate the predicted probability using softmax
    probabilities = F.softmax(logits, dim=-1)  # Convert logits to probabilities
    predicted_probability = probabilities[0][label].item()  # Get the probability of the predicted label

    return emotions[label], predicted_probability

def lr_model(text) -> str:
    lr_model = joblib.load(os.path.join(current_dir, 'lr/lr_model.pkl'))  # Load the Logistic Regression model
    vectorizer = joblib.load(os.path.join(current_dir, 'lr/vectorizer.pkl')) # Load the TF-IDF vectorizer

    new_features = vectorizer.transform([text])  # Transform input text into features using the vectorizer

    # Predict the emotion label using Logistic Regression
    lr_predictions = lr_model.predict(new_features)
    lr_probabilities = lr_model.predict_proba(new_features)  # Probabilities for each class

    # Get the predicted label (emotion index) and probability for that label
    predicted_label = lr_predictions[0]
    predicted_probability = lr_probabilities[0][predicted_label]  # Get the probability for the predicted label

    # Print the predictions and probabilities
    print("Logistic Regression Predictions:")
    print(f"Text: {text}\nPredicted Emotion: {emotions[predicted_label]}\nProbability: {predicted_probability:.4f}\n")

    return emotions[predicted_label], predicted_probability

def rf_model(text) -> str:
    rf_model = joblib.load(os.path.join(current_dir, 'rf/rf_model.pkl'))  # Load the Random Forest model
    vectorizer = joblib.load(os.path.join(current_dir, 'rf/vectorizer.pkl'))  # Load the TF-IDF vectorizer 

    # Transform the input text into features using the vectorizer
    new_features = vectorizer.transform([text]) 

    # Predict the emotion label using Random Forest
    rf_predictions = rf_model.predict(new_features)
    rf_probabilities = rf_model.predict_proba(new_features)  # Probabilities for each class

    # Get the predicted label (emotion index) and probability for that label
    predicted_label = rf_predictions[0]
    predicted_probability = rf_probabilities[0][predicted_label]  # Get the probability for the predicted label

    # Print the predictions and probabilities
    print("Random Forest Predictions:")
    print(f"Text: {text}\nPredicted Emotion: {emotions[predicted_label]}\nProbability: {predicted_probability:.4f}\n")

    return emotions[predicted_label], predicted_probability


# text = "test message"
# b = bert_model(text)
# print(b)
# # RoBERTa MODEL
# r = roberta_model(text)
# # LR MODEL
# l = lr_model(text)
# # RF MODEL
# rf = rf_model(text)

# print(b, r, l, rf)