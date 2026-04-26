import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "../database/cricketxi.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def get_matches():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM matches").fetchall()
    conn.close()
    return [dict(r) for r in rows]

def get_players_by_match(match_id: int):
    conn = get_connection()
    rows = conn.execute(
        """
        SELECT * FROM players
        WHERE match_id = ? AND is_playing_xi = 1
        """,
        (match_id,)
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]