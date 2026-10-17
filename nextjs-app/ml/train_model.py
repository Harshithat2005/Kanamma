import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)

# -----------------------------
# 1. Load dataset
# -----------------------------

DATA_PATH = "maternal_health_risk.csv"

df = pd.read_csv(DATA_PATH)

print("\n========== DATASET ==========")
print("Shape:", df.shape)

print("\nColumns:")
print(df.columns.tolist())

print("\nMissing values:")
print(df.isnull().sum())

print("\nRisk distribution:")
print(df["RiskLevel"].value_counts())


# -----------------------------
# 2. Select features
# -----------------------------

FEATURES = [
    "Age",
    "SystolicBP",
    "DiastolicBP",
    "BS",
    "BodyTemp",
    "HeartRate"
]

TARGET = "RiskLevel"

X = df[FEATURES]
y = df[TARGET]


# -----------------------------
# 3. Train/Test Split
# -----------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print("\n========== DATA SPLIT ==========")
print("Training samples:", len(X_train))
print("Testing samples :", len(X_test))


# -----------------------------
# 4. Random Forest
# -----------------------------

model = RandomForestClassifier(
    n_estimators=300,
    random_state=42,
    class_weight="balanced"
)

model.fit(X_train, y_train)


# -----------------------------
# 5. Predictions
# -----------------------------

y_pred = model.predict(X_test)


# -----------------------------
# 6. Evaluation
# -----------------------------

print("\n========== MODEL RESULTS ==========")

accuracy = accuracy_score(y_test, y_pred)

print(f"Accuracy: {accuracy:.4f}")

print("\nClassification Report:")
print(
    classification_report(
        y_test,
        y_pred,
        digits=4
    )
)

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))


# -----------------------------
# 7. Feature Importance
# -----------------------------

importance = pd.DataFrame({
    "Feature": FEATURES,
    "Importance": model.feature_importances_
})

importance = importance.sort_values(
    by="Importance",
    ascending=False
)

print("\n========== FEATURE IMPORTANCE ==========")
print(importance.to_string(index=False))


# -----------------------------
# 8. Save Model
# -----------------------------

MODEL_PATH = "maternal_risk_model.pkl"

joblib.dump(
    {
        "model": model,
        "features": FEATURES
    },
    MODEL_PATH
)

print("\nModel saved successfully:")
print(MODEL_PATH)