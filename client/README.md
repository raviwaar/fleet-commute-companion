# Fleety — Your Commute Companion App

Fleety is a social and productivity app designed to make your commute more enjoyable and engaging. Users can connect with fellow commuters, participate in games and challenges, explore helpful resources, and manage or join organizations.

This project is built with **React** and **Apollo Client** for frontend, and it connects to a **GraphQL** backend.

---

## Features

- **Role-Based Access Control**: Manage organizations, add/remove members, assign admin roles.
- **Global & Organization Dashboards**: Toggle between personal/global content and organization-specific content.
- **Profile Management**: Update your profile, including profile image and contact info.
- **Interactive Commute Activities**:
    - Puzzle of the day
    - Game of the day
    - Leaderboards
    - Intelligent "Search Near Me" for commute-friendly spots
- **Responsive Design**: Smooth experience across devices.
- **Theme Customization**: Switch between app themes.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (>= 16.x recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- Access to a GraphQL backend (Django/Graphene API for Fleety backend)

---

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/fleety.git
cd fleety
```
2. Install dependencies:
```bash
npm install

```

3. Create a .env file in the root and configure the backend URL:
```bash

REACT_APP_GRAPHQL_URL=http://localhost:8000/graphql

Running the App

Start the development server:

npm start
```



4. Create an optimized production build in the build folder:

```bash

npm run build
```
