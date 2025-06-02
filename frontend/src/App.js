import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AgeGroups = {
  U6: "U6 (Under 6)",
  U8: "U8 (Under 8)", 
  U10: "U10 (Under 10)",
  U12: "U12 (Under 12)",
  U14: "U14 (Under 14)"
};

// Navigation Component
const Navigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'players', label: 'Players', icon: '👥' },
    { id: 'teams', label: 'Teams', icon: '⚽' },
    { id: 'schedule', label: 'Schedule', icon: '📅' },
    { id: 'news', label: 'News', icon: '📰' },
  ];

  return (
    <nav className="bg-white shadow-lg border-b-4 border-blue-600">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">⚽</div>
            <div>
              <h1 className="text-xl font-bold text-blue-800">BlueFire Soccer Club</h1>
              <p className="text-xs text-gray-600">Youth Development Program</p>
            </div>
          </div>
          <div className="flex space-x-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
                  activeTab === tab.id 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Home Dashboard Component
const Dashboard = ({ stats }) => {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1487466365202-1afdb86c764e"
            className="w-full h-full object-cover opacity-20"
            alt="Soccer field"
          />
        </div>
        <div className="relative px-8 py-12 text-white">
          <h1 className="text-4xl font-bold mb-4">Welcome to BlueFire Soccer Club</h1>
          <p className="text-xl text-blue-100 mb-6">Developing young talent, building character, creating champions</p>
          <div className="flex space-x-4">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Register Now
            </button>
            <button className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              View Teams
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Players</p>
              <p className="text-3xl font-bold text-blue-600">{stats.total_players}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Teams</p>
              <p className="text-3xl font-bold text-green-600">{stats.total_teams}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <span className="text-2xl">⚽</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Upcoming Games</p>
              <p className="text-3xl font-bold text-orange-600">{stats.upcoming_games}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <span className="text-2xl">📅</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">News Updates</p>
              <p className="text-3xl font-bold text-purple-600">{stats.recent_news}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <span className="text-2xl">📰</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-6 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-left">
            <div className="text-2xl mb-2">👤</div>
            <h3 className="font-semibold text-gray-800">Register Player</h3>
            <p className="text-gray-600 text-sm">Add new player to the club</p>
          </button>
          <button className="p-6 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left">
            <div className="text-2xl mb-2">🏆</div>
            <h3 className="font-semibold text-gray-800">Create Team</h3>
            <p className="text-gray-600 text-sm">Form new team roster</p>
          </button>
          <button className="p-6 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-left">
            <div className="text-2xl mb-2">📅</div>
            <h3 className="font-semibold text-gray-800">Schedule Game</h3>
            <p className="text-gray-600 text-sm">Add new game to calendar</p>
          </button>
        </div>
      </div>
    </div>
  );
};

// Player Registration Form
const PlayerRegistration = ({ onPlayerRegistered }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    parent_name: '',
    parent_email: '',
    parent_phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API}/players`, {
        ...formData,
        age: parseInt(formData.age)
      });
      setMessage('Player registered successfully!');
      setFormData({
        name: '',
        age: '',
        parent_name: '',
        parent_email: '',
        parent_phone: ''
      });
      onPlayerRegistered();
    } catch (error) {
      setMessage('Error registering player. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-xl p-8 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Register New Player</h2>
      
      {message && (
        <div className={`p-4 rounded-lg mb-6 ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Player Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter player's full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
            <input
              type="number"
              required
              min="4"
              max="16"
              value={formData.age}
              onChange={(e) => setFormData({...formData, age: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Age"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Parent/Guardian Name</label>
            <input
              type="text"
              required
              value={formData.parent_name}
              onChange={(e) => setFormData({...formData, parent_name: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Parent or guardian name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Parent Email</label>
            <input
              type="email"
              required
              value={formData.parent_email}
              onChange={(e) => setFormData({...formData, parent_email: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="parent@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Parent Phone</label>
            <input
              type="tel"
              required
              value={formData.parent_phone}
              onChange={(e) => setFormData({...formData, parent_phone: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="(555) 123-4567"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Registering...' : 'Register Player'}
        </button>
      </form>
    </div>
  );
};

// Players List Component
const PlayersList = ({ players, teams }) => {
  const getTeamName = (teamId) => {
    const team = teams.find(t => t.id === teamId);
    return team ? team.name : 'Unassigned';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Registered Players ({players.length})</h2>
        
        {players.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">👥</div>
            <p className="text-gray-600">No players registered yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Player</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Age Group</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Team</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Parent Contact</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {players.map((player) => (
                  <tr key={player.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-semibold">{player.name.charAt(0)}</span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{player.name}</div>
                          <div className="text-sm text-gray-500">Age {player.age}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {AgeGroups[player.age_group]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getTeamName(player.team_id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{player.parent_name}</div>
                      <div>{player.parent_email}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// Teams Component
const Teams = ({ teams, players }) => {
  const getTeamPlayers = (teamId) => {
    return players.filter(player => player.team_id === teamId);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Team Rosters</h2>
        
        {teams.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">⚽</div>
            <p className="text-gray-600">No teams created yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {teams.map((team) => {
              const teamPlayers = getTeamPlayers(team.id);
              return (
                <div key={team.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{team.name}</h3>
                      <p className="text-gray-600">{AgeGroups[team.age_group]}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{teamPlayers.length}</div>
                      <div className="text-xs text-gray-500">players</div>
                    </div>
                  </div>
                  
                  {team.coach_name && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm font-medium text-blue-800">Coach: {team.coach_name}</div>
                      {team.coach_email && (
                        <div className="text-sm text-blue-600">{team.coach_email}</div>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-700">Team Roster:</h4>
                    {teamPlayers.length === 0 ? (
                      <p className="text-gray-500 text-sm">No players assigned yet</p>
                    ) : (
                      <div className="space-y-1">
                        {teamPlayers.map((player) => (
                          <div key={player.id} className="flex items-center space-x-3 text-sm">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 text-xs font-semibold">{player.name.charAt(0)}</span>
                            </div>
                            <span className="text-gray-700">{player.name} (Age {player.age})</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// Schedule Component
const Schedule = ({ games, teams }) => {
  const getTeamName = (teamId) => {
    const team = teams.find(t => t.id === teamId);
    return team ? team.name : 'Unknown Team';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Game Schedule</h2>
        
        {games.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📅</div>
            <p className="text-gray-600">No games scheduled yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {games.map((game) => (
              <div key={game.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <span className="text-lg font-semibold text-gray-800">
                        {getTeamName(game.home_team_id)} vs {getTeamName(game.away_team_id)}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        game.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        game.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {game.status.charAt(0).toUpperCase() + game.status.slice(1)}
                      </span>
                    </div>
                    <div className="text-gray-600 text-sm">
                      📅 {formatDate(game.date)}
                    </div>
                    <div className="text-gray-600 text-sm">
                      📍 {game.location}
                    </div>
                  </div>
                  
                  {game.status === 'completed' && (game.home_score !== null || game.away_score !== null) && (
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-800">
                        {game.home_score || 0} - {game.away_score || 0}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// News Component
const News = ({ news }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Club News & Announcements</h2>
        
        {news.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📰</div>
            <p className="text-gray-600">No news posted yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {news.map((item) => (
              <article key={item.id} className={`border rounded-xl p-6 ${item.important ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200'}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {item.important && <span className="text-yellow-600 mr-2">⭐</span>}
                      {item.title}
                    </h3>
                    <div className="text-sm text-gray-500">
                      By {item.author} • {formatDate(item.created_at)}
                    </div>
                  </div>
                  {item.important && (
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">
                      Important
                    </span>
                  )}
                </div>
                <div className="text-gray-700 whitespace-pre-wrap">
                  {item.content}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [games, setGames] = useState([]);
  const [news, setNews] = useState([]);
  const [stats, setStats] = useState({
    total_players: 0,
    total_teams: 0,
    upcoming_games: 0,
    recent_news: 0
  });
  const [loading, setLoading] = useState(true);

  // Fetch all data
  const fetchData = async () => {
    try {
      const [playersRes, teamsRes, gamesRes, newsRes, statsRes] = await Promise.all([
        axios.get(`${API}/players`),
        axios.get(`${API}/teams`),
        axios.get(`${API}/games`),
        axios.get(`${API}/news`),
        axios.get(`${API}/stats`)
      ]);

      setPlayers(playersRes.data);
      setTeams(teamsRes.data);
      setGames(gamesRes.data);
      setNews(newsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePlayerRegistered = () => {
    fetchData(); // Refresh all data after registration
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⚽</div>
          <p className="text-gray-600">Loading BlueFire Soccer Club...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'home' && <Dashboard stats={stats} />}
        
        {activeTab === 'players' && (
          <div className="space-y-8">
            <PlayerRegistration onPlayerRegistered={handlePlayerRegistered} />
            <PlayersList players={players} teams={teams} />
          </div>
        )}
        
        {activeTab === 'teams' && <Teams teams={teams} players={players} />}
        {activeTab === 'schedule' && <Schedule games={games} teams={teams} />}
        {activeTab === 'news' && <News news={news} />}
      </main>
    </div>
  );
}

export default App;