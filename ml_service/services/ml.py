import joblib
import pandas as pd
import os
from services.team_mapping import TEAM_FULL_NAMES, VENUE_NAMES

MODEL_PATH   = os.path.join(os.path.dirname(__file__), "../model/model.pkl")
COLUMNS_PATH = os.path.join(os.path.dirname(__file__), "../model/model_columns.pkl")

# load once at startup
model         = joblib.load(MODEL_PATH)
model_columns = joblib.load(COLUMNS_PATH)

print(f"Model loaded — {len(model_columns)} columns ready")

def predict_fantasy_points(players: list, venue: str, opponent_short: str) -> list:
    # map short codes to full names
    opponent_full = TEAM_FULL_NAMES.get(opponent_short, opponent_short)
    venue_full    = VENUE_NAMES.get(venue, venue)

    # build base dataframe
    rows = []
    for p in players:
        rows.append({
            "career_avg_fp" : p["career_avg_fp"],
            "last_5_avg_fp" : p["last_5_avg_fp"],
            "last_3_avg_fp" : p["last_3_avg_fp"],
            "last_match_fp" : p["last_match_fp"],
            "venue"         : venue_full,
            "opponent"      : opponent_full,
        })

    df = pd.DataFrame(rows)

    # one-hot encode
    df = pd.get_dummies(df, columns=["venue", "opponent"])

    # align to training columns — fill missing with 0
    df = df.reindex(columns=model_columns, fill_value=0)

    # predict
    preds = model.predict(df)

    # attach pred_fp back to each player
    for i, p in enumerate(players):
        p["pred_fp"] = round(float(preds[i]), 2)

    return players