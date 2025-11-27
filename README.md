# GrowSmart - Full Stack Plant Application

A comprehensive plant management application built with the MERN stack (MongoDB, Express, React/Next.js, Node.js) and Tailwind CSS.

## Features

### Phase 1 (Completed)
- **User Authentication**: Secure login and registration with JWT.
- **Plant Search**: Search for thousands of plants using the Trefle API.
- **Favorites**: Save your favorite plants to your personal collection.
- **Admin Dashboard**: View system status (Admin only).
- **Responsive Design**: Beautiful UI that works on desktop and mobile.

### Phase 2 (In Progress)
- **Weather Integration**: Real-time weather data and 7-day forecasts with climate suitability analysis.
- **Dashboard**: Unified view with weather widgets and quick actions.
- **Coming Soon**: Disease detection, e-commerce, multilingual support, and smart reminders.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (Local or Atlas)
- Trefle API Token (Get one at [trefle.io](https://trefle.io/))
- OpenWeather API Key (Get one at [openweathermap.org](https://openweathermap.org/api))

## Setup Instructions

### 1. Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Rename `.env.example` to `.env`.
   - Update `MONGO_URI` with your MongoDB connection string.
   - Update `TREFLE_API_TOKEN` with your Trefle API token.
   - Update `OPENWEATHER_API_KEY` with your OpenWeather API key.
   - Update `JWT_SECRET` with a secure secret key.

4. Seed the database (Optional - creates an Admin user):
   ```bash
   npm run seed
   ```
   *Default Admin Credentials:*
   - Email: `admin@example.com`
   - Password: `adminpassword`

5. Start the server:
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:5000`.

### 2. Frontend Setup

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:3000`.

## Usage

1. Open your browser and go to `http://localhost:3000`.
2. Register a new account or login with the admin credentials.
3. Visit the **Dashboard** to see weather information for your location.
4. Use the search bar to find plants.
5. Click "Details" to view more info or the heart icon to add to favorites.
6. View your saved plants in the "Favorites" page.

## Project Structure

- `backend/`: Node.js/Express API
  - `controllers/`: Request handlers
  - `models/`: Mongoose schemas
  - `routes/`: API routes
  - `services/`: External API integration
- `frontend/`: Next.js App
  - `app/`: App Router pages
  - `components/`: Reusable UI components
  - `context/`: React Context (Auth)

## License

MIT
