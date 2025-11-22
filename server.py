from fastapi import FastAPI, Query
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

from datetime import date

app = FastAPI()
app.mount("/assets", StaticFiles(directory="./frontend/dist/assets"), name="assets")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#* API Routes
@app.get("/api/outages")
def get_outages(
    start_date: date = Query(..., description="Start date"),
    end_date: date= Query(..., description="End date"),
):
    print("Getting outages for date range: ", start_date, " to ", end_date)
    return {"message": "Outage data"}

@app.get("/api/outages")
def get_outage(date: date = Query(..., description="Date")):
    print("Getting outage for date: ", date)
    return {"message": "Outage data for date"}

@app.post("/api/outage")
def create_outage():
    print("hitting endpoint")
    return {"message": "Outage created"}

#* Vite
@app.get("/vite.svg")
def serve_vite_svg():
    return FileResponse("./frontend/dist/vite.svg")

@app.get("/{full_path:path}")
def read_root(full_path: str):
    # Don't serve API routes as static files
    if full_path.startswith("api"):
        return {"error": "Not found"}, 404
    
    # Serve index.html for all routes (React Router handles client-side routing)
    return FileResponse("./frontend/dist/index.html")

