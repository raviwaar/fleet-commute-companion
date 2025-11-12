import React from "react";
import Button from "../common/Button";
import SearchNearMe from "../common/SearchNearMe";
import {
    mockUsers,
    mockCommuteTips,
    mockChats,
    mockMiniGames,
    puzzleOfTheDay,
    gameOfTheDay,
} from "../common/mockData";

const GlobalContent: React.FC = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">🌍 Global Dashboard</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Puzzle of the Day */}
                <div className="p-4 bg-white rounded-xl shadow-sm">
                    <h3 className="font-semibold mb-2">🧩 Puzzle of the Day</h3>
                    <p className="text-gray-600">{puzzleOfTheDay.question}</p>
                    <Button className="mt-2" size="sm">
                        Reveal Answer
                    </Button>
                </div>

                {/* Game of the Day */}
                <div className="p-4 bg-white rounded-xl shadow-sm">
                    <h3 className="font-semibold mb-2">🎮 Game of the Day</h3>
                    <p className="text-gray-600">{gameOfTheDay.name}</p>
                    <p className="text-sm text-gray-500">{gameOfTheDay.description}</p>
                    <Button className="mt-2" size="sm">
                        Play Now
                    </Button>
                </div>

                {/* Global Leaderboard */}
                <div className="p-4 bg-white rounded-xl shadow-sm">
                    <h3 className="font-semibold mb-2">🏆 Global Leaderboard</h3>
                    <ol className="list-decimal ml-5 text-gray-600 space-y-1">
                        {mockUsers.sort((a, b) => b.points - a.points).map((u) => (
                            <li key={u.id}>
                                {u.username} - {u.points} pts
                            </li>
                        ))}
                    </ol>
                    <Button className="mt-2" size="sm">
                        See Full Board
                    </Button>
                </div>

                {/* Commute Tips */}
                <div className="p-4 bg-white rounded-xl shadow-sm">
                    <h3 className="font-semibold mb-2">🚗 Commute Tips</h3>
                    <ul className="list-disc ml-5 text-gray-600 space-y-1">
                        {mockCommuteTips.map((tip, idx) => (
                            <li key={idx}>{tip}</li>
                        ))}
                    </ul>
                </div>

                {/* Chat Feed */}
                <div className="p-4 bg-white rounded-xl shadow-sm">
                    <h3 className="font-semibold mb-2">💬 Social Feed</h3>
                    <ul className="space-y-1 text-gray-600">
                        {mockChats.map((chat, idx) => (
                            <li key={idx}>
                                <strong>{chat.user}:</strong> {chat.message}
                            </li>
                        ))}
                    </ul>
                    <Button className="mt-2" size="sm">
                        Join Chat
                    </Button>
                </div>

                {/* Search Near Me */}
                <SearchNearMe />

                {/* Mini-Games */}
                <div className="p-4 bg-white rounded-xl shadow-sm col-span-1 sm:col-span-2">
                    <h3 className="font-semibold mb-2">🎮 Mini-Games</h3>
                    {mockMiniGames.map((game, idx) => (
                        <div key={idx} className="mb-2">
                            <p className="font-medium">{game.name}</p>
                            <p className="text-gray-600 text-sm">{game.description}</p>
                        </div>
                    ))}
                </div>

                {/* Feature Request */}
                <div className="p-4 bg-white rounded-xl shadow-sm col-span-1 sm:col-span-2">
                    <h3 className="font-semibold mb-2">💡 Feature Request</h3>
                    <Button size="sm">Request a Feature</Button>
                </div>
            </div>
        </div>
    );
};

export default GlobalContent;
