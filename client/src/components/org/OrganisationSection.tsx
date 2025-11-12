import React, { useState } from "react";
import ManageOrgPage from "./ManageOrgPage";
import Button from "../common/Button";

interface OrganisationSectionProps {
    memberships: {
        id: string;
        isOrgAdmin: boolean;
        organisation: { id: string; name?: string };
    }[];
}

const OrganisationSection: React.FC<OrganisationSectionProps> = ({ memberships }) => {
    const [selectedOrg, setSelectedOrg] = useState<string | null>(null);

    if (memberships.length === 0)
        return (
            <p className="text-gray-500 text-center border rounded-lg py-8 bg-gray-50">
                You are not part of any organisation yet.
            </p>
        );

    if (selectedOrg) {
        const membership = memberships.find((m) => m.organisation.id === selectedOrg);
        const org = membership?.organisation;
        const isAdmin = membership?.isOrgAdmin;

        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">
                        {org?.name || "Unnamed Organisation"}
                    </h2>
                    <Button variant="secondary" onClick={() => setSelectedOrg(null)}>
                        ← Back
                    </Button>
                </div>

                {isAdmin ? (
                    <ManageOrgPage orgId={selectedOrg} onClose={() => setSelectedOrg(null)} />
                ) : (
                    <div className="bg-white border rounded-xl p-6 shadow-sm space-y-4">
                        <p className="text-gray-700">
                            You are a <strong>member</strong> of this organisation.
                        </p>
                        <div className="p-4 bg-gray-50 border rounded-lg text-gray-600">
                            <p>👥 Member view only — You can see basic info and members.</p>
                            <ul className="mt-2 list-disc list-inside">
                                <li>View organisation details</li>
                                <li>View shared commute groups</li>
                                <li>Access common announcements</li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Your Organisations</h3>
            {memberships.map((m) => (
                <div
                    key={m.id}
                    className="flex justify-between items-center border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition"
                >
                    <div>
                        <p className="font-medium text-gray-900">
                            {m.organisation.name || "Unnamed Org"}
                        </p>
                        <p className="text-sm text-gray-600">
                            Role: {m.isOrgAdmin ? "Admin" : "Member"}
                        </p>
                    </div>
                    <Button variant="primary" onClick={() => setSelectedOrg(m.organisation.id)}>
                        Open
                    </Button>
                </div>
            ))}
        </div>
    );
};

export default OrganisationSection;
