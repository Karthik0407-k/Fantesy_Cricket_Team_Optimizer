CREATE TABLE IF NOT EXISTS matches (
    match_id    INTEGER PRIMARY KEY,
    match_num   TEXT NOT NULL,
    date        TEXT NOT NULL,
    time        TEXT NOT NULL,
    venue       TEXT NOT NULL,
    team1       TEXT NOT NULL,
    team2       TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS players (
    player_id       INTEGER PRIMARY KEY AUTOINCREMENT,
    match_id        INTEGER NOT NULL,
    name            TEXT NOT NULL,
    team            TEXT NOT NULL,
    role            TEXT NOT NULL,
    credits         REAL NOT NULL,
    is_playing_xi   INTEGER DEFAULT 1,
    career_avg_fp   REAL,
    last_5_avg_fp   REAL,
    last_3_avg_fp   REAL,
    last_match_fp   REAL,
    pred_fp         REAL DEFAULT NULL,
    espn_id         INTEGER DEFAULT 0,
    image_url       TEXT DEFAULT '',
    FOREIGN KEY (match_id) REFERENCES matches(match_id)
);