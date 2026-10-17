import joblib
import pandas as pd

# Load trained model
model_data = joblib.load("maternal_risk_model.pkl")

model = model_data["model"]
features = model_data["features"]


def predict_risk(age, systolic_bp, diastolic_bp, blood_sugar, body_temp, heart_rate):

    input_data = pd.DataFrame([{
        "Age": age,
        "SystolicBP": systolic_bp,
        "DiastolicBP": diastolic_bp,
        "BS": blood_sugar,
        "BodyTemp": body_temp,
        "HeartRate": heart_rate
    }])

    prediction = model.predict(input_data)[0]

    probabilities = model.predict_proba(input_data)[0]

    probability_map = dict(
        zip(model.classes_, probabilities)
    )

    return prediction, probability_map


# Test prediction
prediction, probabilities = predict_risk(
    age=25,
    systolic_bp=140,
    diastolic_bp=90,
    blood_sugar=8.5,
    body_temp=98.6,
    heart_rate=90
)

print("\n========== KANNAMMA RISK PREDICTION ==========")
print("Predicted Risk:", prediction)

print("\nRisk Probabilities:")

for risk, probability in probabilities.items():
    print(f"{risk}: {probability:.2%}")