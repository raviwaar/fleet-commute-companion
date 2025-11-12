import React from "react";
import Button from "../common/Button";
import SearchNearMe from "../common/SearchNearMe";
import {OrganisationMembership} from "../../types";
import {
    mockUsers,
    mockOrgCommuteGroups,
    mockChats,
    mockMiniGames,
    puzzleOfTheDay,
    gameOfTheDay,
} from "../common/mockData";

interface OrgContentProps {
    selectedOrg: OrganisationMembership,
    onManageOrg?: () => void,
    memberships?: any[]
}

const OrgContent: React.FC<OrgContentProps> = ({selectedOrg, onManageOrg, memberships}) => {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">
                {selectedOrg.organisation.name || "Org Dashboard"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Org Commute Groups */}
                <div className="p-4 bg-white rounded-xl shadow-sm flex flex-col justify-between">
                    <h3 className="font-semibold mb-2">🚗 Commute Groups</h3>
                    <ul className="text-gray-600 list-disc ml-5 space-y-1">
                        {mockOrgCommuteGroups.map((group, idx) => (
                            <li key={idx}>
                                {group.name} ({group.members} members)
                            </li>
                        ))}
                    </ul>
                    <Button className="mt-3" size="sm">
                        View Groups
                    </Button>
                </div>

                {/* Org Leaderboard */}
                <div className="p-4 bg-white rounded-xl shadow-sm flex flex-col justify-between">
                    <h3 className="font-semibold mb-2">🏆 Org Leaderboard</h3>
                    <ol className="list-decimal ml-5 text-gray-600 space-y-1">
                        {mockUsers.slice(0, 3).map((user) => (
                            <li key={user.id}>
                                {user.username} - {user.points} pts
                            </li>
                        ))}
                    </ol>
                    <Button className="mt-3" size="sm">
                        See Full Board
                    </Button>
                </div>

                {/* Org Chat Feed */}
                <div className="p-4 bg-white rounded-xl shadow-sm flex flex-col justify-between">
                    <h3 className="font-semibold mb-2">💬 Org Chat</h3>
                    <ul className="space-y-1 text-gray-600">
                        {mockChats.map((chat, idx) => (
                            <li key={idx}>
                                <strong>{chat.user}:</strong> {chat.message}
                            </li>
                        ))}
                    </ul>
                    <Button className="mt-3" size="sm">
                        Join Chat
                    </Button>
                </div>

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

                {/* Search Near Me */}
                <SearchNearMe/>

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

export default OrgContent;
