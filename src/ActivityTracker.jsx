import React, { useState, useEffect } from "react";
import {
  Calendar, Clock, Target, TrendingUp, Settings, Plus, Trash2, Edit2, Check, X,
  Award, Flame, Bell, Sun, Moon, Sunset, CloudMoon, ChevronDown, ChevronUp
} from "lucide-react";

import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

// -----------------------------------------------------
// MAIN COMPONENT
// -----------------------------------------------------
export default function ActivityTracker() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("login");
  const [theme, setTheme] = useState("light");

  // ------------------- AUTH -------------------
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // ------------------- ROUTINES -------------------
  const [routines, setRoutines] = useState([]);
  const [newRoutine, setNewRoutine] = useState({
    title: "",
    group: "Morning",
    difficulty: "easy"
  });

  // ------------------- SCHEDULES -------------------
  const [schedules, setSchedules] = useState([]);
  const [newSchedule, setNewSchedule] = useState({
    title: "",
    time: "",
    repeat: "daily",
    category: "work",
    notes: ""
  });

  // ------------------- STREAK -------------------
  const [streak, setStreak] = useState({
    current: 0,
    longest: 0,
    freezeTokens: 3
  });
  const [completedToday, setCompletedToday] = useState(new Set());

  // ------------------- ANALYTICS -------------------
  const [analytics, setAnalytics] = useState({
    weeklyData: [],
    bestDay: "Monday",
    worstDay: "Sunday",
    weeklyAvg: 0,
    monthlyAvg: 0
  });

  // ------------------- NOTES -------------------
  const [dailyNote, setDailyNote] = useState("");
  const [notes, setNotes] = useState([]);

  // -----------------------------------------------------
  // LOAD DEMO DATA WHEN USER LOGS IN
  // -----------------------------------------------------
  useEffect(() => {
    if (currentUser) loadDemoData();
  }, [currentUser]);

  const loadDemoData = () => {
    setRoutines([
      { id: "1", title: "Morning Meditation", group: "Morning", difficulty: "easy", completed: false },
      { id: "2", title: "Exercise", group: "Morning", difficulty: "medium", completed: false },
      { id: "3", title: "Healthy Breakfast", group: "Morning", difficulty: "easy", completed: false },
      { id: "4", title: "Review Goals", group: "Afternoon", difficulty: "easy", completed: false },
      { id: "5", title: "Deep Work Session", group: "Afternoon", difficulty: "hard", completed: false },
      { id: "6", title: "Evening Walk", group: "Evening", difficulty: "easy", completed: false },
      { id: "7", title: "Reading", group: "Night", difficulty: "easy", completed: false }
    ]);

    setSchedules([
      { id: "1", title: "Team Meeting", time: "09:00", repeat: "weekdays", category: "work", notes: "Weekly sync" },
      { id: "2", title: "Gym Session", time: "18:00", repeat: "daily", category: "health", notes: "Workout routine" }
    ]);

    setAnalytics({
      weeklyData: [
        { day: "Mon", score: 85 },
        { day: "Tue", score: 90 },
        { day: "Wed", score: 75 },
        { day: "Thu", score: 95 },
        { day: "Fri", score: 80 },
        { day: "Sat", score: 70 },
        { day: "Sun", score: 65 }
      ],
      bestDay: "Thursday",
      worstDay: "Sunday",
      weeklyAvg: 80,
      monthlyAvg: 78
    });

    setStreak({ current: 7, longest: 15, freezeTokens: 3 });
  };

  // -----------------------------------------------------
  // AUTH HANDLERS
  // -----------------------------------------------------
  const handleRegister = () => {
    if (email && password && name) {
      setCurrentUser({ email, name });
      setActiveTab("dashboard");
    }
  };

  const handleLogin = () => {
    if (email && password) {
      setCurrentUser({ email, name: "Demo User" });
      setActiveTab("dashboard");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab("login");
    setEmail("");
    setPassword("");
  };

  // -----------------------------------------------------
  // ROUTINES
  // -----------------------------------------------------
  const addRoutine = () => {
    if (!newRoutine.title.trim()) return;

    setRoutines([
      ...routines,
      { ...newRoutine, id: Date.now().toString(), completed: false }
    ]);

    setNewRoutine({ title: "", group: "Morning", difficulty: "easy" });
  };

  const toggleRoutine = (id) => {
    setRoutines(
      routines.map((r) =>
        r.id === id ? { ...r, completed: !r.completed } : r
      )
    );
  };

  const deleteRoutine = (id) => {
    setRoutines(routines.filter((r) => r.id !== id));
  };

  const calculateScore = () => {
    if (routines.length === 0) return 0;
    const completed = routines.filter((r) => r.completed).length;
    return Math.round((completed / routines.length) * 100);
  };

  // -----------------------------------------------------
  // SCHEDULE FUNCTIONS
  // -----------------------------------------------------
  const addSchedule = () => {
    if (!newSchedule.title || !newSchedule.time) return;

    setSchedules([...schedules, { ...newSchedule, id: Date.now().toString() }]);
    setNewSchedule({
      title: "",
      time: "",
      repeat: "daily",
      category: "work",
      notes: ""
    });
  };

  const deleteSchedule = (id) => {
    setSchedules(schedules.filter((s) => s.id !== id));
  };

  // -----------------------------------------------------
  // GROUP ROUTINES BY TIME OF DAY
  // -----------------------------------------------------
  const groupedRoutines = {
    Morning: routines.filter((r) => r.group === "Morning"),
    Afternoon: routines.filter((r) => r.group === "Afternoon"),
    Evening: routines.filter((r) => r.group === "Evening"),
    Night: routines.filter((r) => r.group === "Night")
  };

  // -----------------------------------------------------
  // UTILS
  // -----------------------------------------------------
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "hard":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // -----------------------------------------------------
  // LOGIN SCREEN
  // -----------------------------------------------------
  if (!currentUser && activeTab === "login") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-lg p-8 rounded-2xl w-full max-w-md">
          <div className="flex justify-center mb-4">
            <Target className="w-12 h-12 text-blue-600" />
          </div>

          <h1 className="text-2xl font-bold text-center mb-6">
            Activity Tracker
          </h1>

          <input
            className="w-full p-3 rounded-lg bg-gray-200 mb-3"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full p-3 rounded-lg bg-gray-200 mb-4"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />

          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white p-3 rounded-lg"
          >
            Login
          </button>

          <button
            onClick={() => setActiveTab("register")}
            className="w-full mt-3 bg-gray-300 p-3 rounded-lg"
          >
            Create Account
          </button>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------
  // REGISTER SCREEN
  // -----------------------------------------------------
  if (!currentUser && activeTab === "register") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-lg p-8 rounded-2xl w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6">
            Create Account
          </h1>

          <input
            className="w-full p-3 rounded-lg bg-gray-200 mb-3"
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="w-full p-3 rounded-lg bg-gray-200 mb-3"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full p-3 rounded-lg bg-gray-200 mb-4"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />

          <button
            onClick={handleRegister}
            className="w-full bg-blue-600 text-white p-3 rounded-lg"
          >
            Register
          </button>

          <button
            onClick={() => setActiveTab("login")}
            className="w-full mt-3 bg-gray-300 p-3 rounded-lg"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------
  // MAIN APP UI
  // -----------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* HEADER */}
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-8 h-8 text-blue-600" />
            <h1 className="text-xl font-bold">Activity Tracker</h1>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Logout
          </button>
        </div>
      </header>

      {/* NAVIGATION */}
      <nav className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 flex gap-6">
          {["dashboard", "schedules", "analytics", "notes"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 capitalize border-b-2 ${
                activeTab === tab
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* -----------------------------------------------------
           DASHBOARD
        ----------------------------------------------------- */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-6 shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Today's Score</span>
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-3xl font-bold">{calculateScore()}%</div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Streak</span>
                  <Flame className="w-5 h-5 text-orange-600" />
                </div>
                <div className="text-3xl font-bold">{streak.current} days</div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Freeze Tokens</span>
                  <Award className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-3xl font-bold">{streak.freezeTokens}</div>
              </div>
            </div>

            {/* ADD ROUTINE */}
            <div className="bg-white rounded-xl p-6 shadow">
              <h2 className="text-lg font-semibold mb-4">Add Routine</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <input
                  className="p-2 rounded bg-gray-200"
                  placeholder="Routine title"
                  value={newRoutine.title}
                  onChange={(e) =>
                    setNewRoutine({ ...newRoutine, title: e.target.value })
                  }
                />

                <select
                  className="p-2 rounded bg-gray-200"
                  value={newRoutine.group}
                  onChange={(e) =>
                    setNewRoutine({ ...newRoutine, group: e.target.value })
                  }
                >
                  <option>Morning</option>
                  <option>Afternoon</option>
                  <option>Evening</option>
                  <option>Night</option>
                </select>

                <select
                  className="p-2 rounded bg-gray-200"
                  value={newRoutine.difficulty}
                  onChange={(e) =>
                    setNewRoutine({ ...newRoutine, difficulty: e.target.value })
                  }
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>

                <button
                  onClick={addRoutine}
                  className="bg-blue-600 text-white rounded p-2"
                >
                  <Plus className="w-4 h-4 inline-block" /> Add
                </button>
              </div>
            </div>

            {/* ROUTINES BY GROUP */}
            {Object.entries(groupedRoutines).map(([group, items]) => (
              <div key={group} className="bg-white rounded-xl p-6 shadow">
                <h2 className="text-lg font-semibold mb-4">{group}</h2>

                {items.map((routine) => (
                  <div
                    key={routine.id}
                    className="flex items-center justify-between p-3 mb-2 rounded bg-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={routine.completed}
                        onChange={() => toggleRoutine(routine.id)}
                        className="w-5 h-5"
                      />

                      <span
                        className={
                          routine.completed ? "line-through text-gray-500" : ""
                        }
                      >
                        {routine.title}
                      </span>

                      <span
                        className={`px-2 py-1 rounded text-xs ${getDifficultyColor(
                          routine.difficulty
                        )}`}
                      >
                        {routine.difficulty}
                      </span>
                    </div>

                    <button
                      onClick={() => deleteRoutine(routine.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* -----------------------------------------------------
           SCHEDULES TAB
        ----------------------------------------------------- */}
        {activeTab === "schedules" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-lg font-semibold mb-4">Add Schedule</h2>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <input
                  className="p-2 rounded bg-gray-200"
                  placeholder="Title"
                  value={newSchedule.title}
                  onChange={(e) =>
                    setNewSchedule({ ...newSchedule, title: e.target.value })
                  }
                />

                <input
                  type="time"
                  className="p-2 rounded bg-gray-200"
                  value={newSchedule.time}
                  onChange={(e) =>
                    setNewSchedule({ ...newSchedule, time: e.target.value })
                  }
                />

                <select
                  className="p-2 rounded bg-gray-200"
                  value={newSchedule.repeat}
                  onChange={(e) =>
                    setNewSchedule({ ...newSchedule, repeat: e.target.value })
                  }
                >
                  <option>daily</option>
                  <option>weekdays</option>
                  <option>weekends</option>
                  <option>weekly</option>
                </select>

                <select
                  className="p-2 rounded bg-gray-200"
                  value={newSchedule.category}
                  onChange={(e) =>
                    setNewSchedule({ ...newSchedule, category: e.target.value })
                  }
                >
                  <option>work</option>
                  <option>health</option>
                  <option>personal</option>
                  <option>social</option>
                </select>

                <button
                  onClick={addSchedule}
                  className="bg-blue-600 text-white rounded p-2"
                >
                  Add
                </button>
              </div>

              <input
                className="mt-3 w-full p-2 bg-gray-200 rounded"
                placeholder="Notes (optional)"
                value={newSchedule.notes}
                onChange={(e) =>
                  setNewSchedule({ ...newSchedule, notes: e.target.value })
                }
              />
            </div>

            {/* schedules list */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-lg font-semibold mb-4">Your Schedules</h2>

              {schedules.map((s) => (
                <div
                  key={s.id}
                  className="flex justify-between items-center bg-gray-100 p-3 rounded mb-2"
                >
                  <div>
                    <p className="font-bold">{s.title}</p>
                    <p className="text-sm text-gray-600">
                      {s.time} • {s.repeat}
                    </p>
                    {s.notes && (
                      <p className="text-sm text-gray-500 mt-1">{s.notes}</p>
                    )}
                  </div>

                  <button
                    onClick={() => deleteSchedule(s.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* -----------------------------------------------------
           ANALYTICS TAB
        ----------------------------------------------------- */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="text-sm text-gray-500">Weekly Average</h3>
                <div className="text-3xl font-bold">{analytics.weeklyAvg}%</div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="text-sm text-gray-500">Monthly Average</h3>
                <div className="text-3xl font-bold">{analytics.monthlyAvg}%</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
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

            <div className="bg-white p-6 rounded-xl shadow">
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
          </div>
        )}

        {/* -----------------------------------------------------
           NOTES TAB
        ----------------------------------------------------- */}
        {activeTab === "notes" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-lg font-semibold mb-4">Daily Journal</h2>

              <textarea
                className="w-full p-3 rounded bg-gray-200 min-h-[140px]"
                value={dailyNote}
                onChange={(e) => setDailyNote(e.target.value)}
                placeholder="Write your thoughts..."
              />

              <button onClick={() => {
                if (dailyNote.trim().length === 0) return;
                setNotes([
                  { id: Date.now().toString(), text: dailyNote, date: new Date().toLocaleDateString() },
                  ...notes
                ]);
                setDailyNote("");
              }}
              className="mt-3 bg-blue-600 text-white px-6 py-2 rounded-lg"
              >
                Save Note
              </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-lg font-semibold mb-4">Past Entries</h2>

              {notes.length === 0 ? (
                <p className="text-center text-gray-500">No notes yet</p>
              ) : (
                notes.map((note) => (
                  <div key={note.id} className="bg-gray-100 p-4 rounded mb-3">
                    <div className="text-sm text-gray-500 mb-1">{note.date}</div>
                    <p>{note.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
