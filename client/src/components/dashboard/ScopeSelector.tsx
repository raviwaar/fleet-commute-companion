import React from "react";
import GlobalContent from "./GlobalContent";
import OrgContent from "./OrgContent";
import { OrganisationMembership } from "../../types";

interface ScopeSelectorProps {
    selectedOrg: OrganisationMembership | null;
    memberships?: OrganisationMembership[];
    onManageOrg?: () => void;
}

const ScopeSelector: React.FC<ScopeSelectorProps> = ({ selectedOrg, memberships = [], onManageOrg }) => {
    return <div>{selectedOrg ? <OrgContent selectedOrg={selectedOrg} memberships={memberships} onManageOrg={onManageOrg} /> : <GlobalContent />}</div>;
};

export default ScopeSelector;
