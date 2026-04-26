from pulp import LpProblem, LpVariable, LpMaximize, lpSum, LpBinary, value, PULP_CBC_CMD

def optimize_team(players: list) -> dict:
    n = len(players)

    # ── define the problem ────────────────────────────
    prob = LpProblem("Dream11_Team_Selection", LpMaximize)

    # binary variable for each player — 1 = selected, 0 = not
    x = [LpVariable(f"x_{i}", cat=LpBinary) for i in range(n)]

    # captain and vc binary variables
    c  = [LpVariable(f"c_{i}",  cat=LpBinary) for i in range(n)]
    vc = [LpVariable(f"vc_{i}", cat=LpBinary) for i in range(n)]

    # ── objective — maximize total predicted points ───
    # captain gets 2x, vc gets 1.5x, rest get 1x
    prob += lpSum(
        players[i]["pred_fp"] * x[i] +
        players[i]["pred_fp"] * c[i] +
        players[i]["pred_fp"] * 0.5 * vc[i]
        for i in range(n)
    )

    # ── constraints ───────────────────────────────────

    # exactly 11 players
    prob += lpSum(x) == 11

    # captain and vc must be selected
    for i in range(n):
        prob += c[i]  <= x[i]
        prob += vc[i] <= x[i]

    # exactly 1 captain
    prob += lpSum(c) == 1

    # exactly 1 vice captain
    prob += lpSum(vc) == 1

    # captain and vc must be different players
    for i in range(n):
        prob += c[i] + vc[i] <= 1

    # total credits must be <= 100
    prob += lpSum(players[i]["credits"] * x[i] for i in range(n)) <= 100

    # get unique teams
    teams = list(set(p["team"] for p in players))

    # max 7 from any one team
    for team in teams:
        prob += lpSum(x[i] for i in range(n) if players[i]["team"] == team) <= 7

    # min 4 from any one team
    for team in teams:
        prob += lpSum(x[i] for i in range(n) if players[i]["team"] == team) >= 4

    # role constraints — min 1 max 4 each
    for role in ["WK", "BAT", "AR", "BOWL"]:
        role_players = [i for i in range(n) if players[i]["role"] == role]
        prob += lpSum(x[i] for i in role_players) >= 1
        prob += lpSum(x[i] for i in role_players) <= 4

    # ── solve ─────────────────────────────────────────
    prob.solve(PULP_CBC_CMD(msg=0))

    # ── extract results ───────────────────────────────
    selected = []
    for i in range(n):
        if value(x[i]) == 1:
            player = players[i].copy()
            if value(c[i]) == 1:
                player["captain"] = True
                player["vice_captain"] = False
            elif value(vc[i]) == 1:
                player["captain"] = False
                player["vice_captain"] = True
            else:
                player["captain"] = False
                player["vice_captain"] = False
            selected.append(player)

    # sort by role for field display
    role_order = {"WK": 0, "BAT": 1, "AR": 2, "BOWL": 3}
    selected.sort(key=lambda p: role_order[p["role"]])

    total_credits = round(sum(p["credits"] for p in selected), 1)
    total_pred    = round(sum(
        p["pred_fp"] * (2 if p["captain"] else 1.5 if p["vice_captain"] else 1)
        for p in selected
    ), 2)

    return {
        "best_xi"       : selected,
        "total_credits" : total_credits,
        "total_pred_fp" : total_pred,
        "status"        : "optimal"
    }