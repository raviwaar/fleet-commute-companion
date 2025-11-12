// Users for leaderboards
export const mockUsers = [
    { id: "u1", username: "Alice", points: 120 },
    { id: "u2", username: "Bob", points: 95 },
    { id: "u3", username: "Charlie", points: 150 },
    { id: "u4", username: "Dana", points: 80 },
    { id: "u5", username: "Eve", points: 110 },
];

// Commute tips
export const mockCommuteTips = [
    "Take a podcast or audiobook to make your commute enjoyable.",
    "Plan your route to avoid traffic hotspots.",
    "Use public transit apps to track delays in real-time.",
    "Carpool when possible to reduce stress and save costs.",
    "Keep water and snacks handy for long commutes.",
];

// Org commute groups (for OrgContent)
export const mockOrgCommuteGroups = [
    { name: "Morning Carpool", members: 12 },
    { name: "Bike Enthusiasts", members: 8 },
    { name: "Evening Walkers", members: 5 },
];

// Chat feed
export const mockChats = [
    { user: "Alice", message: "Anyone up for a morning ride tomorrow?" },
    { user: "Bob", message: "I just tried the new cafe near Main St, amazing!" },
    { user: "Charlie", message: "Puzzle of the day is tough 😅" },
    { user: "Dana", message: "Check out the leaderboard, I'm climbing fast!" },
];

// Mini-games
export const mockMiniGames = [
    { name: "Trivia Challenge", description: "Answer 5 questions and earn points." },
    { name: "Commute Puzzle", description: "Solve the puzzle of the day for bonus rewards." },
    { name: "Memory Lane", description: "Match the cards and test your memory skills." },
];

// Puzzle of the Day
export const puzzleOfTheDay = {
    question: "I speak without a mouth and hear without ears. What am I?",
    answer: "Echo",
};

// Game of the Day
export const gameOfTheDay = {
    name: "Trivia Challenge",
    description: "Answer 5 questions correctly and earn 50 points!",
};

// Nearby places for "Search Near Me" (mock intelligent suggestions)
export const mockNearbyPlaces = [
    {
        name: "Hidden Coffee Spot",
        distance: "0.5 km",
        type: "Cafe",
        description: "A tiny cozy coffee shop with artisan brews.",
        commute: ["walking", "bike", "car"],
    },
    {
        name: "Secret Park",
        distance: "1.2 km",
        type: "Park",
        description: "A quiet green park off the main road for relaxation.",
        commute: ["walking", "bike"],
    },
    {
        name: "Local Art Gallery",
        distance: "0.8 km",
        type: "Gallery",
        description: "Featuring local artists every month.",
        commute: ["walking", "car"],
    },
    {
        name: "Hidden Book Nook",
        distance: "1 km",
        type: "Bookstore",
        description: "Small bookstore with rare finds.",
        commute: ["walking", "bike"],
    },
    {
        name: "Commuter Snack Hub",
        distance: "0.6 km",
        type: "Snack",
        description: "Quick bites and coffee for commuters.",
        commute: ["walking", "car"],
    },
];
