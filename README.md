# 🏆 Contest Tracker

A full-stack web application that aggregates and displays upcoming competitive programming contests from **Codeforces**, **LeetCode**, and **CodeChef** in real-time — all in one place.

🌐 **Live Demo**: [contest-tracker-neon.vercel.app](https://contest-tracker-neon.vercel.app)

---

## ✨ Features

- 🔴 **Multi-Platform Aggregation** — Fetches contests from Codeforces, LeetCode & CodeChef simultaneously
- ⏱️ **Live Countdown Timers** — Real-time countdowns showing when each contest starts or ends
- 🎛️ **Platform Filters** — Filter contests by site with a single click
- 🔄 **Manual Refresh** — Fetch the latest contest data on demand
- 🌙 **Dark Mode UI** — Sleek dark dashboard with glassmorphic card design
- 🛡️ **Rate Limiting** — Backend protected against abuse with IP-based rate limiting
- 🔒 **CORS Protection** — Restricted API access to the frontend domain only

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | Web server |
| TypeScript | Type safety |
| Axios | HTTP requests to external APIs |
| `express-rate-limit` | Rate limiting |
| `cors` | Cross-origin security |
| `dotenv` | Environment variable management |
| `tsx` | TypeScript dev server with hot reload |

### Frontend
| Technology | Purpose |
|---|---|
| React + TypeScript | UI framework |
| Vite | Build tool & dev server |
| TailwindCSS v4 | Styling |
| Lucide React | Icons |

### Deployment
| Service | Purpose |
|---|---|
| Render | Backend hosting |
| Vercel | Frontend hosting |
| GitHub | Version control |

---

## 📡 APIs Used

| Platform | API Type | Endpoint |
|---|---|---|
| Codeforces | REST | `https://codeforces.com/api/contest.list` |
| LeetCode | GraphQL | `https://leetcode.com/graphql/` |
| CodeChef | REST | `https://www.codechef.com/api/list/contests/all` |

---

## 📂 Project Structure

```
Contest Tracker/
├── Backend/
│   ├── src/
│   │   ├── types/
│   │   │   └── contest.ts         # TypeScript interfaces for all APIs
│   │   ├── services/
│   │   │   └── contestService.ts  # Fetches, normalizes & sorts contest data
│   │   ├── routes/
│   │   │   └── contestRoutes.ts   # GET /contests Express route
│   │   └── index.ts               # Server entry (CORS, rate limiting, routes)
│   ├── tsconfig.json
│   └── package.json
│
├── Frontend/
│   ├── public/
│   │   └── logo.jpg               # Browser tab favicon
│   ├── src/
│   │   ├── types/
│   │   │   └── contest.ts         # Frontend TypeScript interfaces
│   │   ├── components/
│   │   │   └── contestCard.tsx    # Contest card with live countdown
│   │   ├── App.tsx                # Main layout, filtering & data fetching
│   │   ├── main.tsx               # React entry point
│   │   └── index.css              # TailwindCSS import
│   ├── index.html
│   └── vite.config.ts
│
└── .gitignore
```

---

## 🚀 Running Locally

### Prerequisites
- Node.js v18+
- npm

### 1. Clone the repository
```bash
git clone https://github.com/ayush-code07/Contest-Tracker.git
cd Contest-Tracker
```

### 2. Run the Backend
```bash
cd Backend
npm install
npm run dev
```
Backend runs on: `http://localhost:3000`

### 3. Run the Frontend
Open a new terminal:
```bash
cd Frontend
npm install
npm run dev
```
Frontend runs on: `http://localhost:5173`

---

## 🔑 Environment Variables

### Backend (`Backend/.env`)
| Variable | Description | Example |
|---|---|---|
| `PORT` | Port for the server | `3000` |
| `ALLOWED_ORIGIN` | Frontend URL for CORS | `https://contest-tracker-neon.vercel.app` |

### Frontend (`Frontend/.env`)
| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `https://your-backend.onrender.com` |

---

## 📋 API Endpoints

### `GET /contests`
Returns a combined, chronologically sorted list of upcoming and ongoing contests from all platforms.

**Response:**
```json
{
  "success": true,
  "count": 12,
  "data": [
    {
      "id": "Codeforces-2064",
      "name": "Codeforces Round 1000 (Div. 2)",
      "url": "https://codeforces.com/contests/2064",
      "startTime": "2026-07-29T14:35:00.000Z",
      "endTime": "2026-07-29T16:35:00.000Z",
      "durationSeconds": 7200,
      "site": "Codeforces",
      "status": "UPCOMING"
    }
  ]
}
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
