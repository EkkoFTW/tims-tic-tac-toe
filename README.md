# 🎮 Tic-Tac-Toe AI – Built with React & TypeScript

- Welcome to my take on the classic Tic-Tac-Toe game — redesigned with a modern front-end, strong separation of concerns, and a touch of AI logic originally crafted in C++. Some added feature like `AI optimisation` / `"infinite"` board size / `Game History` from the C++ original code.
- This project was created as part of a technical challenge for TIMS.

---

## 🧩 Features

- 🧑‍🤝‍🧑 **1v1 Mode** – Local two-player play.
- 🤖 **AI Opponent** with 3 difficulty levels:
    - **Easy** – Random moves.
    - **Medium** – Heuristic-based strategy (center/corners, threat evaluation).
    - **Hard** – Full **Minimax algorithm** with **Alpha-Beta pruning**.

- 🧠 **Game History & Stats** tracking per session.
- 💡 Clean and responsive UI with **Tailwind CSS**.

---

## 🛠️ Stack & Tools Used

| Tool               | Purpose / Reasoning                                                                 |
|--------------------|-------------------------------------------------------------------------------------|
| **React**          | Component-based architecture, fast development                                      |
| **TypeScript**     | Static typing for better maintainability and clarity                                |
| **Tailwind CSS**   | Utility-first styling for rapid, consistent UI development                          |
| **Context API**    | Global state management without Redux overhead                                      |
| **JetBrains RustRover** | IDE of choice (used daily for Rust, so naturally used it here too)                |
| **ChatGPT**        | Helped analyze and convert the C++ AI logic into a performant TypeScript version     |
| **Old C++ AI Code**| Reused logic from a past project (adapted & optimized for front-end performance)     |

---

## 🧠 What I Learned / Challenges Faced

### 🔄 Translating C++ AI Logic to React
- The original **Minimax with Alpha-Beta** implementation was in C++ and easier to run at full speed.
- Translating to JS/TS involved careful performance tuning, and memoization tweaks.
- **Challenge:** Making it fast enough for real-time use in the browser without freezing the UI.
- **Solution:** Limited recursion depth in some cases, structured the logic for readability and performance.

### 💬 ChatGPT & Rubber Ducking
- Used ChatGPT as a brainstorming assistant to:
    - Some optimisation for PositionCaching for example
    - Refactor code for clarity
    - Discuss state vs props logic in React

### ⚙️ Clean Front-End Architecture
- Learned to better structure apps using:
    - `contexts/` for global state
    - `models/` for domain types
    - `services/` for logic
    - `components/` broken down into focused units (Board, Square, Header, History, etc.)

## 🧪 How to Run

```bash
# Clone the repo
git clone https://github.com/EkkoFTW/tims-tic-tac-toe.git
cd tims-tic-tac-toe

# Install dependencies
npm install

# Run the dev server
npm run dev

# Build for production
npm run build