import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Target, TrendingUp, Settings, Plus, Trash2, Edit2, Check, X, Award, Flame, Bell, Sun, Moon, Sunset, CloudMoon, ChevronDown, ChevronUp } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ActivityTracker() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('login');
  const [theme, setTheme] = useState('light');
  
  // Auth states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  // Routines state
  const [routines, setRoutines] = useState([]);
  const [newRoutine, setNewRoutine] = useState({ title: '', group: 'Morning', difficulty: 'easy' });
  const [editingRoutine, setEditingRoutine] = useState(null);
  
  // Schedules state
  const [schedules, setSchedules] = useState([]);
  const [newSchedule, setNewSchedule] = useState({ title: '', time: '', repeat: 'daily', category: 'work', notes: '' });
  
  // Streak state
  const [streak, setStreak] = useState({ current: 0, longest: 0, freezeTokens: 3 });
  const [completedToday, setCompletedToday] = useState(new Set());
  
  // Analytics state
  const [analytics, setAnalytics] = useState({
    weeklyData: [],
    bestDay: 'Monday',
    worstDay: 'Sunday',
    weeklyAvg: 0,
    monthlyAvg: 0
  });

  // Notes state
  const [dailyNote, setDailyNote] = useState('');
  const [notes, setNotes] = useState([]);

  // Initialize demo data
  useEffect(() => {
    if (currentUser) {
      loadDemoData();
    }
  }, [currentUser]);

  const loadDemoData = () => {
    setRoutines([
      { id: '1', title: 'Morning Meditation', group: 'Morning', difficulty: 'easy', completed: false },
      { id: '2', title: 'Exercise', group: 'Morning', difficulty: 'medium', completed: false },
      { id: '3', title: 'Healthy Breakfast', group: 'Morning', difficulty: 'easy', completed: false },
      { id: '4', title: 'Review Goals', group: 'Afternoon', difficulty: 'easy', completed: false },
      { id: '5', title: 'Deep Work Session', group: 'Afternoon', difficulty: 'hard', completed: false },
      { id: '6', title: 'Evening Walk', group: 'Evening', difficulty: 'easy', completed: false },
      { id: '7', title: 'Reading', group: 'Night', difficulty: 'easy', completed: false }
    ]);

    setSchedules([
      { id: '1', title: 'Team Meeting', time: '09:00', repeat: 'weekdays', category: 'work', notes: 'Weekly sync' },
      { id: '2', title: 'Gym Session', time: '18:00', repeat: 'daily', category: 'health', notes: 'Workout routine' }
    ]);

    setAnalytics({
      weeklyData: [
        { day: 'Mon', score: 85 },
        { day: 'Tue', score: 90 },
        { day: 'Wed', score: 75 },
        { day: 'Thu', score: 95 },
        { day: 'Fri', score: 80 },
        { day: 'Sat', score: 70 },
        { day: 'Sun', score: 65 }
      ],
      bestDay: 'Thursday',
      worstDay: 'Sunday',
      weeklyAvg: 80,
      monthlyAvg: 78
    });

    setStreak({ current: 7, longest: 15, freezeTokens: 3 });
  };

  // Auth functions
  const handleRegister = () => {
    if (email && password && name) {
      setCurrentUser({ email, name });
      setActiveTab('dashboard');
    }
  };

  const handleLogin = () => {
    if (email && password) {
      setCurrentUser({ email, name: 'Demo User' });
      setActiveTab('dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('login');
    setEmail('');
    setPassword('');
  };

  // Routines functions
  const addRoutine = () => {
    if (newRoutine.title) {
      setRoutines([...routines, { ...newRoutine, id: Date.now().toString(), completed: false }]);
      setNewRoutine({ title: '', group: 'Morning', difficulty: 'easy' });
    }
  };

  const toggleRoutine = (id) => {
    setRoutines(routines.map(r => {
      if (r.id === id) {
        const newCompleted = !r.completed;
        if (newCompleted) {
          setCompletedToday(new Set([...completedToday, id]));
        } else {
          const newSet = new Set(completedToday);
          newSet.delete(id);
          setCompletedToday(newSet);
        }
        return { ...r, completed: newCompleted };
      }
      return r;
    }));
  };

  const deleteRoutine = (id) => {
    setRoutines(routines.filter(r => r.id !== id));
  };

  const calculateScore = () => {
    if (routines.length === 0) return 0;
    const completed = routines.filter(r => r.completed).length;
    return Math.round((completed / routines.length) * 100);
  };

  // Schedules functions
  const addSchedule = () => {
    if (newSchedule.title && newSchedule.time) {
      setSchedules([...schedules, { ...newSchedule, id: Date.now().toString() }]);
      setNewSchedule({ title: '', time: '', repeat: 'daily', category: 'work', notes: '' });
    }
  };

  const deleteSchedule = (id) => {
    setSchedules(schedules.filter(s => s.id !== id));
  };

  // Group routines
  const groupedRoutines = {
    Morning: routines.filter(r => r.group === 'Morning'),
    Afternoon: routines.filter(r => r.group === 'Afternoon'),
    Evening: routines.filter(r => r.group === 'Evening'),
    Night: routines.filter(r => r.group === 'Night')
  };

  const getGroupIcon = (group) => {
    switch(group) {
      case 'Morning': return <Sun className="w-5 h-5" />;
      case 'Afternoon': return <Sunset className="w-5 h-5" />;
      case 'Evening': return <Moon className="w-5 h-5" />;
      case 'Night': return <CloudMoon className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Add note
  const saveDailyNote = () => {
    if (dailyNote.trim()) {
      setNotes([{ id: Date.now().toString(), text: dailyNote, date: new Date().toLocaleDateString() }, ...notes]);
      setDailyNote('');
    }
  };

  // Render login
  if (!currentUser && activeTab === 'login') {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-md mx-auto pt-20 px-6">
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-8`}>
            <div className="flex items-center justify-center mb-6">
              <Target className="w-12 h-12 text-blue-600" />
            </div>
            <h1 className={`text-2xl font-bold text-center mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Activity Tracker</h1>
            
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg mb-3 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100'}`}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg mb-4 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100'}`}
            />
            
            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition mb-3"
            >
              Login
            </button>
            
            <button
              onClick={() => setActiveTab('register')}
              className={`w-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} py-3 rounded-lg font-semibold hover:bg-gray-300 transition`}
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render register
  if (!currentUser && activeTab === 'register') {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-md mx-auto pt-20 px-6">
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-8`}>
            <h1 className={`text-2xl font-bold text-center mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Create Account</h1>
            
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg mb-3 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100'}`}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg mb-3 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100'}`}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg mb-4 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100'}`}
            />
            
            <button
              onClick={handleRegister}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition mb-3"
            >
              Register
            </button>
            
            <button
              onClick={() => setActiveTab('login')}
              className={`w-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} py-3 rounded-lg font-semibold hover:bg-gray-300 transition`}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main app
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-8 h-8 text-blue-600" />
            <h1 className="text-xl font-bold">Activity Tracker</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border-b`}>
        <div className="max-w-6xl mx-auto px-6 flex gap-6">
          {['dashboard', 'schedules', 'analytics', 'notes'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 capitalize font-medium border-b-2 transition ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent hover:text-blue-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Score & Streak Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500">Today's Score</span>
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-3xl font-bold">{calculateScore()}%</div>
                <div className="text-sm text-gray-500 mt-1">{routines.filter(r => r.completed).length}/{routines.length} completed</div>
              </div>

              <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500">Current Streak</span>
                  <Flame className="w-5 h-5 text-orange-600" />
                </div>
                <div className="text-3xl font-bold">{streak.current} days</div>
                <div className="text-sm text-gray-500 mt-1">Longest: {streak.longest} days</div>
              </div>

              <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500">Freeze Tokens</span>
                  <Award className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-3xl font-bold">{streak.freezeTokens}</div>
                <div className="text-sm text-gray-500 mt-1">Save your streak</div>
              </div>
            </div>

            {/* Add New Routine */}
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm`}>
              <h2 className="text-lg font-semibold mb-4">Add New Routine</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <input
                  type="text"
                  placeholder="Routine title"
                  value={newRoutine.title}
                  onChange={(e) => setNewRoutine({...newRoutine, title: e.target.value})}
                  className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}
                />
                <select
                  value={newRoutine.group}
                  onChange={(e) => setNewRoutine({...newRoutine, group: e.target.value})}
                  className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}
                >
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Evening">Evening</option>
                  <option value="Night">Night</option>
                </select>
                <select
                  value={newRoutine.difficulty}
                  onChange={(e) => setNewRoutine({...newRoutine, difficulty: e.target.value})}
                  className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                <button
                  onClick={addRoutine}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
            </div>

            {/* Routines by Group */}
            {Object.entries(groupedRoutines).map(([group, items]) => (
              items.length > 0 && (
                <div key={group} className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm`}>
                  <div className="flex items-center gap-2 mb-4">
                    {getGroupIcon(group)}
                    <h2 className="text-lg font-semibold">{group}</h2>
                    <span className="text-sm text-gray-500">({items.filter(i => i.completed).length}/{items.length})</span>
                  </div>
                  <div className="space-y-2">
                    {items.map(routine => (
                      <div
                        key={routine.id}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <input
                            type="checkbox"
                            checked={routine.completed}
                            onChange={() => toggleRoutine(routine.id)}
                            className="w-5 h-5 cursor-pointer"
                          />
                          <span className={routine.completed ? 'line-through text-gray-500' : ''}>
                            {routine.title}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(routine.difficulty)}`}>
                            {routine.difficulty}
                          </span>
                        </div>
                        <button
                          onClick={() => deleteRoutine(routine.id)}
                          className="text-red-600 hover:bg-red-100 p-2 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        )}

        {/* Schedules Tab */}
        {activeTab === 'schedules' && (
          <div className="space-y-6">
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm`}>
              <h2 className="text-lg font-semibold mb-4">Add New Schedule</h2>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={newSchedule.title}
                  onChange={(e) => setNewSchedule({...newSchedule, title: e.target.value})}
                  className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}
                />
                <input
                  type="time"
                  value={newSchedule.time}
                  onChange={(e) => setNewSchedule({...newSchedule, time: e.target.value})}
                  className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}
                />
                <select
                  value={newSchedule.repeat}
                  onChange={(e) => setNewSchedule({...newSchedule, repeat: e.target.value})}
                  className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}
                >
                  <option value="daily">Daily</option>
                  <option value="weekdays">Weekdays</option>
                  <option value="weekends">Weekends</option>
                  <option value="weekly">Weekly</option>
                </select>
                <select
                  value={newSchedule.category}
                  onChange={(e) => setNewSchedule({...newSchedule, category: e.target.value})}
                  className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}
                >
                  <option value="work">Work</option>
                  <option value="health">Health</option>
                  <option value="personal">Personal</option>
                  <option value="social">Social</option>
                </select>
                <button
                  onClick={addSchedule}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
              <input
                type="text"
                placeholder="Notes (optional)"
                value={newSchedule.notes}
                onChange={(e) => setNewSchedule({...newSchedule, notes: e.target.value})}
                className={`w-full px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}
              />
            </div>

            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm`}>
              <h2 className="text-lg font-semibold mb-4">Your Schedules</h2>
              <div className="space-y-3">
                {schedules.map(schedule => (
                  <div
                    key={schedule.id}
                    className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-blue-600" />
                          <h3 className="font-semibold">{schedule.title}</h3>
                          <span className="text-sm px-2 py-1 bg-blue-100 text-blue-700 rounded">
                            {schedule.category}
                          </span>
                        </div>
                        <div className="mt-2 text-sm text-gray-500 ml-8">
                          <p>{schedule.time} • {schedule.repeat}</p>
                          {schedule.notes && <p className="mt-1">{schedule.notes}</p>}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteSchedule(schedule.id)}
                        className="text-red-600 hover:bg-red-100 p-2 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm`}>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Weekly Average</h3>
                <div className="text-3xl font-bold">{analytics.weeklyAvg}%</div>
              </div>
              <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm`}>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Monthly Average</h3>
                <div className="text-3xl font-bold">{analytics.monthlyAvg}%</div>
              </div>
            </div>

            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm`}>
              <h2 className="text-lg font-semibold mb-4">Weekly Progress</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm`}>
              <h2 className="text-lg font-semibold mb-4">Performance Analysis</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="score" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm`}>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Best Day</h3>
                <div className="text-2xl font-bold text-green-600">{analytics.bestDay}</div>
              </div>
              <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm`}>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Needs Improvement</h3>
                <div className="text-2xl font-bold text-orange-600">{analytics.worstDay}</div>
              </div>
            </div>

            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm`}>
              <h2 className="text-lg font-semibold mb-4">Milestones</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[7, 14, 30, 50, 100].map(days => (
                  <div
                    key={days}
                    className={`p-4 rounded-lg text-center ${
                      streak.longest >= days
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    <Award className="w-6 h-6 mx-auto mb-2" />
                    <div className="font-bold">{days} Days</div>
                    <div className="text-xs">{streak.longest >= days ? 'Achieved!' : 'Locked'}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <div className="space-y-6">
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm`}>
              <h2 className="text-lg font-semibold mb-4">Daily Journal</h2>
              <textarea
                value={dailyNote}
                onChange={(e) => setDailyNote(e.target.value)}
                placeholder="How was your day? What did you learn?"
                className={`w-full px-4 py-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} min-h-32`}
              />
              <button
                onClick={saveDailyNote}
                className="mt-3 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Save Note
              </button>
            </div>

            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm`}>
              <h2 className="text-lg font-semibold mb-4">Past Entries</h2>
              {notes.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No notes yet. Start journaling!</p>
              ) : (
                <div className="space-y-4">
                  {notes.map(note => (
                    <div
                      key={note.id}
                      className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">{note.date}</span>
                      </div>
                      <p>{note.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
