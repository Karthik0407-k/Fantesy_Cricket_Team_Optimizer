from fastapi import APIRouter, HTTPException
from services.db import get_players_by_match, get_matches
from services.ml import predict_fantasy_points
from services.optimizer import optimize_team
from schemas import PredictRequest, PredictResponse

router = APIRouter()

@router.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    # get match info for venue and opponent mapping
    matches = get_matches()
    match   = next((m for m in matches if m["match_id"] == req.match_id), None)

    if not match:
        raise HTTPException(status_code=404, detail="Match not found")

    # get all playing xi players
    players = get_players_by_match(req.match_id)

    if len(players) < 11:
        raise HTTPException(status_code=400, detail="Not enough players in playing XI")

    # for each player predict against their opponent
    # team1 players face team2 as opponent and vice versa
    team1_players = [p for p in players if p["team"] == match["team1"]]
    team2_players = [p for p in players if p["team"] == match["team2"]]

    team1_predicted = predict_fantasy_points(
        team1_players,
        venue         = match["venue"],
        opponent_short= match["team2"]
    )

    team2_predicted = predict_fantasy_points(
        team2_players,
        venue         = match["venue"],
        opponent_short= match["team1"]
    )

    all_players = team1_predicted + team2_predicted

    # run PuLP optimizer
    result = optimize_team(all_players)

    return result