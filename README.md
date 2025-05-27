# Astro + FastApi (SSR + CSR)

This project is a **proof of concept (POC)** to practice with:

- ⚡️ [Astro](https://astro.build/) and its SSR capabilities
- 🧠 Zustand for global state management
- 🔄 Hydration of React components with `client:load`
- 🐳 Docker and Docker Compose for full-stack setup
- 🔧 SSR with API calls at build-time using `axios`
- 🔁 Client-side refresh of data after SSR
- ✍️ Modal forms and API integration (update user info)
- 📦 Serve production build using `serve`

## Running the Project

To build and run everything:

```bash
make run
```

This will:

    1. Build both backend and frontend containers
    2. Start the backend (Python + uv)
    3. Start the frontend (Astro with SSR enabled)
    4. Serve the app at http://localhost:3000
    5. Expose the backend API at http://localhost:8000

## How It Works

- Astro fetches data from the backend at build time for SSR.
- Zustand stores user data globally in the browser.
- On client hydration, polling checks for updated usernames.
- Visual diffs are shown if usernames have changed (by ID).
- A modal allows editing a user's username and password using a PUT request.
- The app uses Docker networks to allow astro-app to reach the backend via http://backend:8000.


## Technologies Used
- FastApi
- Astro
- React
- Zustand
- Axios
- Docker + Docker Compose
- uv (Python dependency manager)