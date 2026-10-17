from pathlib import Path

import joblib
import pandas as pd
from fastapi import FastAPI
from pydantic import BaseModel


# --------------------------------------------------
# Load trained model
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "maternal_risk_model.pkl"

saved_model = joblib.load(MODEL_PATH)

model = saved_model["model"]
features = saved_model["features"]


# --------------------------------------------------
# FastAPI application
# --------------------------------------------------

app = FastAPI(
    title="Kannamma Maternal Risk ML API",
    version="0.1.0"
)


# --------------------------------------------------
# Request schema
# --------------------------------------------------

class RiskInput(BaseModel):
    Age: float
    SystolicBP: float
    DiastolicBP: float
    BS: float
    BodyTemp: float
    HeartRate: float


# --------------------------------------------------
# Health check
# --------------------------------------------------

@app.get("/")
def root():
    return {
        "service": "Kannamma Maternal Risk ML API",
        "status": "running"
    }


# --------------------------------------------------
# Risk prediction
# --------------------------------------------------

@app.post("/predict")
def predict_risk(data: RiskInput):

    input_data = pd.DataFrame(
        [[
            data.Age,
            data.SystolicBP,
            data.DiastolicBP,
            data.BS,
            data.BodyTemp,
            data.HeartRate
        ]],
        columns=features
    )

    prediction = model.predict(input_data)[0]

    probabilities = model.predict_proba(input_data)[0]

    class_probabilities = {
        class_name: float(probability)
        for class_name, probability
        in zip(model.classes_, probabilities)
    }

    return {
        "riskLevel": str(prediction),
        "probabilities": class_probabilities
    }