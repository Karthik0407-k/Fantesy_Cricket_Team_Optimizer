from fastapi import APIRouter, HTTPException
from services.db import get_matches, get_players_by_match

router = APIRouter()

@router.get("/matches")
def fetch_matches():
    matches = get_matches()
    if not matches:
        raise HTTPException(status_code=404, detail="No matches found")
    return matches

@router.get("/matches/{match_id}/players")
def fetch_players(match_id: int):
    players = get_players_by_match(match_id)
    if not players:
        raise HTTPException(status_code=404, detail=f"No players found for match {match_id}")
    return players