import React, { useState } from "react";
import Button from "./Button";
import { mockNearbyPlaces } from "./mockData";

const SearchNearMe: React.FC = () => {
    const [commuteType, setCommuteType] = useState<"walking" | "bike" | "car">("walking");
    const [searchResult, setSearchResult] = useState<typeof mockNearbyPlaces>([]);

    const handleSearch = () => {
        // Filter mock places based on selected commute type
        const results = mockNearbyPlaces.filter((place) =>
            place.commute.includes(commuteType)
        );
        setSearchResult(results);
    };

    return (
        <div className="p-4 bg-white rounded-xl shadow-sm">
            <h3 className="font-semibold mb-2">📍 Search Near Me</h3>

            <div className="flex space-x-2 mb-3">
                <select
                    value={commuteType}
                    onChange={(e) => setCommuteType(e.target.value as any)}
                    className="border px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    <option value="walking">Walking</option>
                    <option value="bike">Bike</option>
                    <option value="car">Car</option>
                </select>
                <Button size="sm" onClick={handleSearch}>
                    Search
                </Button>
            </div>

            {searchResult.length === 0 ? (
                <p className="text-gray-500 text-sm">
                    No places found. Try a different commute type.
                </p>
            ) : (
                <ul className="space-y-2 text-gray-600">
                    {searchResult.map((place, idx) => (
                        <li key={idx} className="border rounded p-2">
                            <p className="font-medium">{place.name}</p>
                            <p className="text-sm">{place.type} - {place.distance}</p>
                            <p className="text-gray-500 text-sm">{place.description}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchNearMe;
