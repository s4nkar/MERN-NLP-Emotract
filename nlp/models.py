from utils import emotions
from transformers import RobertaTokenizer, RobertaForSequenceClassification, BertForSequenceClassification, BertTokenizer
import torch
import joblib

def bert_model(text) -> str:
    bert_model = BertForSequenceClassification.from_pretrained('bert/model')
    tokenizer = BertTokenizer.from_pretrained('bert/tokenizer')

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
    prediction = outputs.logits.argmax(dim=-1)
    label = prediction.item()
    return emotions[label]

def roberta_model(text) -> str:
    roberta_model = RobertaForSequenceClassification.from_pretrained('roberta/model')
    tokenizer = RobertaTokenizer.from_pretrained('roberta/tokenizer')

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
    prediction = outputs.logits.argmax(dim=-1)
    label = prediction.item()
    return emotions[label]

def lr_model(text) -> str:
    lr_model = joblib.load('lr/lr_model.pkl')  # Load the Logistic Regression model
    vectorizer = joblib.load('lr/vectorizer.pkl') # Load the TF-IDF vectorizer

    new_features = vectorizer.transform([text])

    # Predict using Logistic Regression
    lr_predictions = lr_model.predict(new_features)
    lr_probabilities = lr_model.predict_proba(new_features)  # Probabilities for each class

    label = 27

    # Print the predictions and probabilities
    print("Logistic Regression Predictions:")
    for text, pred, prob in zip([text], lr_predictions, lr_probabilities):
        label = pred
        print(f"Text: {text}\nPredicted Emotion: {pred}\nProbabilities: {prob}\n")

    return emotions[label]

def rf_model(text) -> str:
    rf_model = joblib.load('rf/rf_model.pkl')  # Load the Random Forest model
    vectorizer = joblib.load('rf/vectorizer.pkl')  # Load the TF-IDF vectorizer

    new_features = vectorizer.transform([text])

    # Predict using Random Forest
    rf_predictions = rf_model.predict(new_features)
    rf_probabilities = rf_model.predict_proba(new_features)  # Probabilities for each class

    label = 27

    # Print the predictions and probabilities
    print("Random Forest Predictions:")
    for text, pred, prob in zip([text], rf_predictions, rf_probabilities):
        label = pred
        print(f"Text: {text}\nPredicted Emotion: {pred}\nProbabilities: {prob}\n")

    return emotions[label]

# text = "test message"
# b = bert_model(text)
# # RoBERTa MODEL
# r = roberta_model(text)
# # LR MODEL
# l = lr_model(text)
# # RF MODEL
# rf = rf_model(text)

# print(b, r, l, rf)