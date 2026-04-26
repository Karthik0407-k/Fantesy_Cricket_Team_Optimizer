import sqlite3
import json
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "cricketxi.db")
JSON_PATH = os.path.join(os.path.dirname(__file__), "ipl_matches.json")
SCHEMA_PATH = os.path.join(os.path.dirname(__file__), "schema.sql")

def create_tables(conn):
    with open(SCHEMA_PATH, "r") as f:
        conn.executescript(f.read())
    print("Tables created successfully")

def seed_matches(conn, matches):
    for m in matches:
        conn.execute(
            """
            INSERT OR IGNORE INTO matches
            (match_id, match_num, date, time, venue, team1, team2)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                m["match_id"],
                m["match_num"],
                m["date"],
                m["time"],
                m["venue"],
                m["team1"]["short"],
                m["team2"]["short"],
            ),
        )
    print(f"Inserted {len(matches)} matches")

def seed_players(conn, matches):
    count = 0
    for m in matches:
        for team in [m["team1"], m["team2"]]:
            for p in team["players"]:
                conn.execute(
                    """
                    INSERT OR IGNORE INTO players
                    (match_id, name, team, role, credits, is_playing_xi,
                     career_avg_fp, last_5_avg_fp, last_3_avg_fp,
                     last_match_fp, espn_id, image_url)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        m["match_id"],
                        p["name"],
                        team["short"],
                        p["role"],
                        p["credits"],
                        1 if p["is_playing_xi"] else 0,
                        p["career_avg_fp"],
                        p["last_5_avg_fp"],
                        p["last_3_avg_fp"],
                        p["last_match_fp"],
                        p["espn_id"],
                        p["image_url"],
                    ),
                )
                count += 1
    print(f"Inserted {count} players")

def verify(conn):
    print("\n--- Verification ---")
    matches = conn.execute("SELECT * FROM matches").fetchall()
    print(f"Total matches : {len(matches)}")
    for m in matches:
        players = conn.execute(
            "SELECT COUNT(*) FROM players WHERE match_id = ?", (m[0],)
        ).fetchone()[0]
        print(f"  Match {m[0]} : {m[5]} vs {m[6]} — {players} players")

    total = conn.execute("SELECT COUNT(*) FROM players").fetchone()[0]
    print(f"Total players : {total}")

def main():
    # load JSON
    with open(JSON_PATH, "r") as f:
        data = json.load(f)

    matches = data["matches"]

    # connect and seed
    conn = sqlite3.connect(DB_PATH)

    create_tables(conn)
    seed_matches(conn, matches)
    seed_players(conn, matches)
    conn.commit()

    verify(conn)
    conn.close()

    print("\nPhase 1 complete — cricketxi.db is ready")

if __name__ == "__main__":
    main()