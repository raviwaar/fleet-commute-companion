import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_USER_MEMBERSHIPS } from "../../graphql/queries/orgQueries";
import { useAuth } from "../../contexts/AuthContext";
import OrgSelector from "../org/OrgSelector";
import ManageOrgPage from "../org/ManageOrgPage";
import ScopeSelector from "../dashboard/ScopeSelector";
import Button from "../../components/common/Button";
import { OrganisationMembership } from "../../types";
import ProfilePage from "./ProfilePage";

const DashboardPage: React.FC = () => {
    const { user, logout } = useAuth();
    const { data, loading, error } = useQuery(GET_USER_MEMBERSHIPS);

    const memberships: OrganisationMembership[] = data?.myMemberships || [];
    const organisations = memberships.map((m) => m.organisation);

    const [selectedOrg, setSelectedOrg] = useState<OrganisationMembership | null>(null);
    const [showManageOrg, setShowManageOrg] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    useEffect(() => {
        // Default to Global view if no memberships or error
        if (memberships.length === 0 || error) {
            setSelectedOrg(null);
        }
    }, [memberships, error]);

    if (loading) return <p className="text-center mt-8">Loading dashboard...</p>;

    // Map selectedOrg to membership object
    const currentMembership = selectedOrg
        ? memberships.find((m) => m.organisation.id === selectedOrg.organisation.id) || null
        : null;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white shadow-sm py-4 px-8 flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-blue-700">Fleety</h1>

                <div className="flex items-center space-x-4">
                    {/* Org selector only if memberships exist */}
                    {memberships.length > 0 && !error && (
                        <OrgSelector
                            organisations={organisations}
                            memberships={memberships}
                            selectedOrg={selectedOrg ? selectedOrg.organisation : null}
                            setSelectedOrg={(org) => {
                                const m = memberships.find((mem) => mem.organisation.id === org?.id) || null;
                                setSelectedOrg(m);
                            }}
                            onManageOrg={() => setShowManageOrg(true)}
                        />
                    )}

                    {/* Profile button */}
                    <Button variant="secondary" size="sm" onClick={() => setShowProfile(true)}>
                        Profile
                    </Button>

                    {/* Logout */}
                    <Button variant="secondary" size="sm" onClick={logout}>
                        Logout
                    </Button>
                </div>
            </header>

            {/* Main content */}
            <main className="flex-grow max-w-5xl mx-auto w-full py-10 px-6 space-y-8">
                <h2 className="text-center text-xl font-semibold mb-8">
                    Welcome <span className="text-blue-700">{user?.username || "User"}</span> 🚗
                </h2>

                {/* ManageOrg inline panel */}
                {showManageOrg && currentMembership && (
                    <ManageOrgPage
                        orgId={currentMembership.organisation.id}
                        onClose={() => setShowManageOrg(false)}
                    />
                )}

                {/* Profile page modal */}
                {showProfile && <ProfilePage onClose={() => setShowProfile(false)} />}

                {/* Global / Org content */}
                <ScopeSelector
                    selectedOrg={currentMembership}
                    memberships={memberships}
                    onManageOrg={() => setShowManageOrg(true)}
                />
            </main>
        </div>
    );
};

export default DashboardPage;
