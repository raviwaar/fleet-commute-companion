import React from "react";
import Button from "../common/Button";
import { Organisation, OrganisationMembership } from "../../types";

interface OrgSelectorProps {
    organisations: Organisation[];
    memberships: OrganisationMembership[];
    selectedOrg: Organisation | null;
    setSelectedOrg: (org: Organisation | null) => void;
    onManageOrg: () => void;
}

const OrgSelector: React.FC<OrgSelectorProps> = ({
                                                     organisations,
                                                     memberships,
                                                     selectedOrg,
                                                     setSelectedOrg,
                                                     onManageOrg,
                                                 }) => {
    // Determine which orgs user is admin of
    const adminOrgs = new Set(
        memberships.filter((m) => m.isOrgAdmin).map((m) => m.organisation.id)
    );
    const isOrgAdmin = selectedOrg ? adminOrgs.has(selectedOrg.id) : false;

    return (
        <div className="flex items-center space-x-2">
            {/* Org dropdown */}
            <select
                value={selectedOrg?.id || ""}
                onChange={(e) => {
                    const org = organisations.find((o) => o.id === e.target.value);
                    setSelectedOrg(org || null);
                }}
                className="border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
                <option value="">🌍 Global</option>
                {organisations.map((org) => (
                    <option key={org.id} value={org.id}>
                        {org.name} {adminOrgs.has(org.id) ? "(Admin)" : ""}
                    </option>
                ))}
            </select>

            {/* Inline Manage Org button */}
            {isOrgAdmin && selectedOrg && (
                <Button
                    size="sm"
                    variant="primary"
                    className="whitespace-nowrap"
                    onClick={onManageOrg}
                >
                    Manage Org
                </Button>
            )}
        </div>
    );
};

export default OrgSelector;
