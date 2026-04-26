from pydantic import BaseModel
from typing import List, Optional

class MatchOut(BaseModel):
    match_id  : int
    match_num : str
    date      : str
    time      : str
    venue     : str
    team1     : str
    team2     : str

class PlayerOut(BaseModel):
    player_id     : int
    match_id      : int
    name          : str
    team          : str
    role          : str
    credits       : float
    is_playing_xi : int
    career_avg_fp : float
    last_5_avg_fp : float
    last_3_avg_fp : float
    last_match_fp : float
    pred_fp       : Optional[float] = None
    espn_id       : int
    image_url     : str

class PredictRequest(BaseModel):
    match_id : int

class PredictResponse(BaseModel):
    best_xi       : List[dict]
    total_credits : float
    total_pred_fp : float
    status        : str