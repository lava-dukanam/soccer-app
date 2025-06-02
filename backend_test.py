import requests
import sys
import json
from datetime import datetime

class SoccerClubAPITester:
    def __init__(self, base_url):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.created_resources = {
            "players": [],
            "teams": [],
            "games": [],
            "news": []
        }

    def run_test(self, name, method, endpoint, expected_status, data=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return success, response.json()
                except:
                    return success, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"Response: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test the root API endpoint"""
        success, response = self.run_test(
            "Root API Endpoint",
            "GET",
            "",
            200
        )
        return success

    def test_stats_endpoint(self):
        """Test the stats endpoint"""
        success, response = self.run_test(
            "Stats Endpoint",
            "GET",
            "stats",
            200
        )
        if success:
            print(f"Stats: {json.dumps(response, indent=2)}")
        return success

    def test_create_team(self, name, age_group, coach_name=None, coach_email=None):
        """Create a team"""
        data = {
            "name": name,
            "age_group": age_group
        }
        if coach_name:
            data["coach_name"] = coach_name
        if coach_email:
            data["coach_email"] = coach_email
            
        success, response = self.run_test(
            f"Create Team ({name})",
            "POST",
            "teams",
            200,
            data=data
        )
        if success and "id" in response:
            self.created_resources["teams"].append(response)
            print(f"Created team: {response['name']} ({response['age_group']})")
        return success, response

    def test_get_teams(self):
        """Get all teams"""
        success, response = self.run_test(
            "Get All Teams",
            "GET",
            "teams",
            200
        )
        if success:
            print(f"Found {len(response)} teams")
            for team in response:
                print(f"- {team['name']} ({team['age_group']})")
        return success, response

    def test_get_team(self, team_id):
        """Get a team by ID"""
        success, response = self.run_test(
            f"Get Team by ID ({team_id})",
            "GET",
            f"teams/{team_id}",
            200
        )
        return success, response

    def test_get_team_players(self, team_id):
        """Get players for a team"""
        success, response = self.run_test(
            f"Get Team Players ({team_id})",
            "GET",
            f"teams/{team_id}/players",
            200
        )
        if success:
            print(f"Found {len(response)} players in team")
        return success, response

    def test_register_player(self, name, age, parent_name, parent_email, parent_phone):
        """Register a player"""
        data = {
            "name": name,
            "age": age,
            "parent_name": parent_name,
            "parent_email": parent_email,
            "parent_phone": parent_phone
        }
        
        success, response = self.run_test(
            f"Register Player ({name})",
            "POST",
            "players",
            200,
            data=data
        )
        if success and "id" in response:
            self.created_resources["players"].append(response)
            print(f"Registered player: {response['name']} (Age: {response['age']}, Age Group: {response['age_group']})")
            if response.get("team_id"):
                print(f"Auto-assigned to team ID: {response['team_id']}")
            else:
                print("Not assigned to any team")
        return success, response

    def test_get_players(self):
        """Get all players"""
        success, response = self.run_test(
            "Get All Players",
            "GET",
            "players",
            200
        )
        if success:
            print(f"Found {len(response)} players")
        return success, response

    def test_get_player(self, player_id):
        """Get a player by ID"""
        success, response = self.run_test(
            f"Get Player by ID ({player_id})",
            "GET",
            f"players/{player_id}",
            200
        )
        return success, response

    def test_create_game(self, home_team_id, away_team_id, date, location):
        """Create a game"""
        data = {
            "home_team_id": home_team_id,
            "away_team_id": away_team_id,
            "date": date.isoformat(),
            "location": location
        }
        
        success, response = self.run_test(
            "Create Game",
            "POST",
            "games",
            200,
            data=data
        )
        if success and "id" in response:
            self.created_resources["games"].append(response)
            print(f"Created game: {response['home_team_id']} vs {response['away_team_id']} at {response['location']}")
        return success, response

    def test_get_games(self):
        """Get all games"""
        success, response = self.run_test(
            "Get All Games",
            "GET",
            "games",
            200
        )
        if success:
            print(f"Found {len(response)} games")
        return success, response

    def test_create_news(self, title, content, author, important=False):
        """Create a news item"""
        data = {
            "title": title,
            "content": content,
            "author": author,
            "important": important
        }
        
        success, response = self.run_test(
            f"Create News ({title})",
            "POST",
            "news",
            200,
            data=data
        )
        if success and "id" in response:
            self.created_resources["news"].append(response)
            print(f"Created news: {response['title']}")
        return success, response

    def test_get_news(self):
        """Get all news"""
        success, response = self.run_test(
            "Get All News",
            "GET",
            "news",
            200
        )
        if success:
            print(f"Found {len(response)} news items")
        return success, response

def main():
    # Get the backend URL from environment variable or use default
    backend_url = "https://7a6d820e-bca6-439d-99df-74bf26f05495.preview.emergentagent.com/api"
    
    print(f"Testing Soccer Club API at: {backend_url}")
    tester = SoccerClubAPITester(backend_url)
    
    # Test root endpoint
    tester.test_root_endpoint()
    
    # Test stats endpoint
    tester.test_stats_endpoint()
    
    # Test teams endpoints
    success, teams = tester.test_get_teams()
    
    # Create teams if none exist
    if success and len(teams) == 0:
        tester.test_create_team("Lightning Bolts", "U8", "John Smith", "john@example.com")
        tester.test_create_team("Thunder Hawks", "U10", "Sarah Johnson", "sarah@example.com")
        success, teams = tester.test_get_teams()
    
    # Test player registration and auto-assignment
    if success and len(teams) > 0:
        # Register players for different age groups
        tester.test_register_player("Alex Johnson", 7, "Mike Johnson", "mike@example.com", "555-123-4567")
        tester.test_register_player("Emma Smith", 9, "Lisa Smith", "lisa@example.com", "555-987-6543")
        tester.test_register_player("Noah Williams", 5, "David Williams", "david@example.com", "555-456-7890")
        tester.test_register_player("Olivia Brown", 11, "Karen Brown", "karen@example.com", "555-789-0123")
        
        # Get all players
        success, players = tester.test_get_players()
        
        # Test getting players for a team
        if success and len(teams) > 0 and len(players) > 0:
            team_id = teams[0]["id"]
            tester.test_get_team_players(team_id)
    
    # Test games endpoints
    if success and len(teams) >= 2:
        # Create a game
        game_date = datetime.now()
        tester.test_create_game(teams[0]["id"], teams[1]["id"], game_date, "Main Soccer Field")
        tester.test_get_games()
    
    # Test news endpoints
    tester.test_create_news(
        "Season Kickoff Event",
        "Join us for the season kickoff event this Saturday at the main field. There will be food, games, and a chance to meet the coaches!",
        "Admin",
        True
    )
    tester.test_get_news()
    
    # Print results
    print(f"\n📊 Tests passed: {tester.tests_passed}/{tester.tests_run}")
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())
