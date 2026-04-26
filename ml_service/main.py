from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import matches, predict

app = FastAPI(
    title       = "CricketXI ML Service",
    description = "Fantasy team prediction using Random Forest + PuLP",
    version     = "1.0.0"
)

# allow Express backend to call this
app.add_middleware(
    CORSMiddleware,
    allow_origins     = ["http://localhost:5000"],
    allow_credentials = True,
    allow_methods     = ["*"],
    allow_headers     = ["*"],
)

# register routers
app.include_router(matches.router)
app.include_router(predict.router)

@app.get("/")
def root():
    return {"message": "CricketXI ML Service is running"}