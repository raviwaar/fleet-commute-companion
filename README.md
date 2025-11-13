# Move With Fleet - Fleety Commute Companion

**Move With Fleet** is a social and productivity app designed to make every commute a unique, engaging experience. Whether connecting with colleagues, solving puzzles, or discovering local resources, Fleety transforms commuting into an interactive and enjoyable journey.

---

## Table of Contents

1. [Project Overview](#project-overview)  
2. [Key Features](#key-features)  
3. [Getting Started](#getting-started)  
4. [Architecture](#architecture)  
5. [Future Enhancements](#future-enhancements)  

---

## Project Overview

Fleety is designed with three core philosophies:

1. **Every Commute is a New Experience**  
   - Users can engage with *Puzzle of the Day*, *Game of the Day*, and live social games with colleagues or other commuters.  
   - Lightweight competitions and leaderboards create fun and meaningful interactions without feeling intrusive.

2. **Easy Onboarding & Organic Adoption**  
   - Users quickly understand the benefits of **Move With Fleet**.  
   - Even if users leave a specific organisation, they retain access to global resources, maintaining engagement.

3. **Optimized Local Discovery**  
   - The *Find Near Me* feature allows users to search for local resources beyond standard map apps.  
   - Fine-grained, localized searches improve adoption and provide utility during daily commutes.

4. **Privacy-First Engagement**  
   - Users are never tracked or monitored.  
   - Global resources, games, and puzzles allow social outreach while preserving anonymity.  
   - Feature requests allow users to shape the app according to their needs.

---

## Key Features

- **Global Dashboard** – Access worldwide puzzles, games, and resources.  
- **Organisation Dashboard** – Engage with your company or group, compete on leaderboards, and join live games.  
- **Manage Organisation** – For admins to add/remove members, assign roles, and manage content.  
- **Profile Management** – Update user information including profile image, contact info, and preferences.  
- **Interactive Daily Content** – Puzzle of the day, game of the day, and live interactive sessions.  
- **Find Near Me** – Intelligent localized search for resources during commute.  
- **Theme & Personalization** – Users can switch themes and personalize their dashboard.  
- **Feedback & Feature Requests** – Users can submit feature requests directly from the app.

---

## Getting Started

1. **Clone the repository**

```bash
git clone <repository-url>
cd fleet-commute-companion
```

2. **Install dependencies**

```bash
cd client
npm install
```

3. **Start the frontend**

```bash
npm run build
npm run dev
```

4. **Backend Setup (Django GraphQL)**

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
---

## Architecture

- **Frontend:** React, TypeScript, Apollo Client  
- **Backend:** Django, Graphene GraphQL, PostgreSQL  
- **State Management:** Context API (AuthContext)  
- **Styling:** TailwindCSS  
- **Hosting:** Vercel / Netlify for frontend, Heroku / AWS EC2 for backend  

---

## Future Enhancements

- **Expanded Game Modes** – Multiplayer live games with leaderboard integration  
- **Enhanced Localization** – Support for multiple cities and languages  
- **Push Notifications** – Notify users of live puzzles and game invites  
- **Analytics Dashboard** – Allow org admins to track engagement (anonymized)  

---

## Vision

Fleety transforms commuting into an interactive and engaging experience while prioritizing user privacy and social engagement. Through daily puzzles, games, and intelligent local resources, users can explore, connect, and enjoy every journey. Feature requests ensure the app grows organically based on user needs.

---

