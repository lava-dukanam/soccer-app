from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, date
from enum import Enum


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Enums
class AgeGroup(str, Enum):
    U6 = "U6"
    U8 = "U8"
    U10 = "U10"
    U12 = "U12"
    U14 = "U14"


# Models
class Player(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    age: int
    age_group: AgeGroup
    parent_name: str
    parent_email: str
    parent_phone: str
    team_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class PlayerCreate(BaseModel):
    name: str
    age: int
    parent_name: str
    parent_email: str
    parent_phone: str


class Team(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    age_group: AgeGroup
    coach_name: Optional[str] = None
    coach_email: Optional[str] = None
    player_count: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)


class TeamCreate(BaseModel):
    name: str
    age_group: AgeGroup
    coach_name: Optional[str] = None
    coach_email: Optional[str] = None


class Game(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    home_team_id: str
    away_team_id: str
    date: datetime
    location: str
    status: str = "scheduled"  # scheduled, completed, cancelled
    home_score: Optional[int] = None
    away_score: Optional[int] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class GameCreate(BaseModel):
    home_team_id: str
    away_team_id: str
    date: datetime
    location: str


class News(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    content: str
    author: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    important: bool = False


class NewsCreate(BaseModel):
    title: str
    content: str
    author: str
    important: bool = False


# Helper function to determine age group
def get_age_group(age: int) -> AgeGroup:
    if age <= 6:
        return AgeGroup.U6
    elif age <= 8:
        return AgeGroup.U8
    elif age <= 10:
        return AgeGroup.U10
    elif age <= 12:
        return AgeGroup.U12
    else:
        return AgeGroup.U14


# Player endpoints
@api_router.post("/players", response_model=Player)
async def register_player(player_data: PlayerCreate):
    # Determine age group
    age_group = get_age_group(player_data.age)
    
    # Create player
    player = Player(
        **player_data.dict(),
        age_group=age_group
    )
    
    # Insert into database
    result = await db.players.insert_one(player.dict())
    
    # Try to assign to an existing team
    team = await db.teams.find_one({"age_group": age_group})
    if team and team.get("player_count", 0) < 15:  # Max 15 players per team
        # Update player with team_id
        player.team_id = team["id"]
        await db.players.update_one(
            {"id": player.id},
            {"$set": {"team_id": team["id"]}}
        )
        # Update team player count
        await db.teams.update_one(
            {"id": team["id"]},
            {"$inc": {"player_count": 1}}
        )
    
    return player


@api_router.get("/players", response_model=List[Player])
async def get_players():
    players = await db.players.find().to_list(1000)
    return [Player(**player) for player in players]


@api_router.get("/players/{player_id}", response_model=Player)
async def get_player(player_id: str):
    player = await db.players.find_one({"id": player_id})
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")
    return Player(**player)


# Team endpoints
@api_router.post("/teams", response_model=Team)
async def create_team(team_data: TeamCreate):
    team = Team(**team_data.dict())
    await db.teams.insert_one(team.dict())
    return team


@api_router.get("/teams", response_model=List[Team])
async def get_teams():
    teams = await db.teams.find().to_list(1000)
    return [Team(**team) for team in teams]


@api_router.get("/teams/{team_id}", response_model=Team)
async def get_team(team_id: str):
    team = await db.teams.find_one({"id": team_id})
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    return Team(**team)


@api_router.get("/teams/{team_id}/players", response_model=List[Player])
async def get_team_players(team_id: str):
    players = await db.players.find({"team_id": team_id}).to_list(1000)
    return [Player(**player) for player in players]


# Game endpoints
@api_router.post("/games", response_model=Game)
async def create_game(game_data: GameCreate):
    game = Game(**game_data.dict())
    await db.games.insert_one(game.dict())
    return game


@api_router.get("/games", response_model=List[Game])
async def get_games():
    games = await db.games.find().sort("date", 1).to_list(1000)
    return [Game(**game) for game in games]


@api_router.get("/games/{game_id}", response_model=Game)
async def get_game(game_id: str):
    game = await db.games.find_one({"id": game_id})
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    return Game(**game)


# News endpoints
@api_router.post("/news", response_model=News)
async def create_news(news_data: NewsCreate):
    news = News(**news_data.dict())
    await db.news.insert_one(news.dict())
    return news


@api_router.get("/news", response_model=List[News])
async def get_news():
    news_items = await db.news.find().sort("created_at", -1).to_list(1000)
    return [News(**news) for news in news_items]


# Dashboard stats
@api_router.get("/stats")
async def get_dashboard_stats():
    total_players = await db.players.count_documents({})
    total_teams = await db.teams.count_documents({})
    upcoming_games = await db.games.count_documents({"date": {"$gt": datetime.utcnow()}})
    recent_news = await db.news.count_documents({})
    
    return {
        "total_players": total_players,
        "total_teams": total_teams,
        "upcoming_games": upcoming_games,
        "recent_news": recent_news
    }


# Root endpoint
@api_router.get("/")
async def root():
    return {"message": "Youth Soccer Club Management API"}


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
