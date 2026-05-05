# RunTracker Client

The frontend for **RunTracker** — a web application for tracking and sharing running progress with friends.

Built with React and Vite. Connects to the [runtracker-api](https://github.com/Marco-1234567/runtracker-api) backend.

## Features

- 🔗 Connect your Strava account via OAuth
- 📊 Weekly running overview with charts
- 👟 Share progress with your running crew
- ⚡ Auto-sync runs from Strava

## Tech Stack

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [React Router](https://reactrouter.com/)

## Getting Started

### Prerequisites

- Node.js 18+
- The [runtracker-api](https://github.com/Marco-1234567/runtracker-api) backend running locally

### Installation

```bash
# Clone the repo
git clone https://github.com/Marco-1234567/runtracker-client.git
cd runtracker-client

# Install dependencies
npm install

# Create your local environment file
cp .env.example .env
```

### Environment Variables

Create a `.env` file in the project root:

```
VITE_API_URL=http://localhost:8080
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
├── components/       # Reusable UI components
├── pages/            # Page-level components
├── App.jsx           # Root component and routing
└── main.jsx          # Entry point
```

## Related

- [runtracker-api](https://github.com/Marco-1234567/runtracker-api) — Spring Boot backend