# 🎮 Live Quiz Game — WebSocket Backend

Real-time multiplayer quiz game backend built with Node.js and WebSockets.

This project implements a fully interactive quiz engine where a host creates a game, players join using a room code, and answer questions in real time with scoring based on response speed.

---

## 🚀 Features

* 🔐 User registration & login
* 🎯 Host-controlled game creation
* 🔑 6-character room code system
* 👥 Real-time player join/leave
* ⚡ Live question broadcasting
* ⏱️ Server-side timers per question
* 🧠 Score calculation based on answer speed
* 📊 Live results after each question
* 🏁 Final leaderboard with ranking
* 🔌 Robust disconnect handling
* 📡 Event-driven WebSocket architecture

---

## 🧠 Game Flow

1. Players register/login
2. Host creates a game with questions
3. Players join via room code
4. Host starts the game
5. Questions are broadcast in real time
6. Players submit answers
7. Scores are calculated based on speed
8. Results are broadcast after each round
9. Final leaderboard is shown at the end

---

## 🏗️ Architecture

The backend is structured into clear layers:

```
WebSocket (ws)
↓
Handlers (event routing)
↓
Services (game logic)
↓
Store (in-memory state)
```

### 📂 Project Structure

```
server/
├── handlers/        # WS event handlers (reg, join, answer, disconnect, etc.)
├── services/        # Game logic (questions, scoring, flow)
├── store/           # In-memory storage (players, games, connections)
├── utils/           # Helpers (broadcast, send, id generation)
├── types/           # TypeScript interfaces
└── index.ts         # WebSocket server entry point
```

---

## ⚙️ Tech Stack

* Node.js (v24+)
* TypeScript
* ws (WebSocket library)

---

## 📡 WebSocket Protocol

All communication is JSON-based:

```json
{
  "type": "event_name",
  "data": {},
  "id": 0
}
```

### Key Events

| Event             | Description           |
| ----------------- | --------------------- |
| `reg`             | Register/Login        |
| `create_game`     | Host creates a game   |
| `join_game`       | Player joins          |
| `start_game`      | Host starts game      |
| `question`        | Broadcast question    |
| `answer`          | Player submits answer |
| `question_result` | Round results         |
| `game_finished`   | Final leaderboard     |

---

## ⏱️ Scoring System

Score depends on both correctness and speed:

```
points = 1000 * (timeRemaining / timeLimit)
```

* ✅ Correct answer → up to 1000 points
* ❌ Wrong / no answer → 0 points
* ⚡ Faster answers → higher score

---

## 🔄 Real-Time Mechanics

* All players receive events simultaneously via WebSocket
* Server controls timers (not client)
* Game state is fully synchronized
* Early question completion if all players answered

---

## 🔌 Disconnect Handling

The system gracefully handles disconnects:

* Player removed from game
* Player list updated in real time
* If host disconnects → game ends
* If all players leave → game is deleted
* Mid-question disconnects handled safely

---

## 🧪 Edge Cases Covered

* Duplicate answers prevention
* Invalid question index handling
* Joining after game start blocked
* Unauthorized actions prevented
* Timer-safe question finalization
* Race conditions minimized

---

## ▶️ Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run server

```bash
npm run start
```

Server will start on:

```
ws://localhost:3000
```

---

## 🧩 Frontend

Frontend is provided separately (React app).
This backend is fully compatible with it out of the box.

---

## 📈 Future Improvements

* Reconnect support for players
* Persistent storage (PostgreSQL / Redis)
* Horizontal scaling (multi-instance)
* Spectator mode
* Admin panel for hosts

---

## 👨‍💻 Author

Aliaksei Varabyou

---

## 💬 Notes

This project demonstrates:

* Real-time system design
* WebSocket architecture
* State management without a database
* Event-driven backend design
* Handling concurrency & edge cases
