import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ORG_MEMBERS } from "../../graphql/queries/orgQueries";
import { ADD_ORG_MEMBER, REMOVE_ORG_MEMBER, UPDATE_MEMBER_ROLE } from "../../graphql/mutations/orgMutations";
import Button from "../common/Button";
import { Membership } from "../../types";
import { useAuth } from "../../contexts/AuthContext";

interface ManageOrgPageProps {
    orgId: string;
    onClose: () => void;
}

const ManageOrgPage: React.FC<ManageOrgPageProps> = ({ orgId, onClose }) => {
    const { user } = useAuth();
    const { data, loading, error, refetch } = useQuery(GET_ORG_MEMBERS, { variables: { orgId } });

    const [searchTerm, setSearchTerm] = useState("");
    const [newMemberUsername, setNewMemberUsername] = useState("");
    const [newMemberIsAdmin, setNewMemberIsAdmin] = useState(false);

    const [addMember] = useMutation(ADD_ORG_MEMBER, { onCompleted: () => refetch() });
    const [removeMember] = useMutation(REMOVE_ORG_MEMBER, { onCompleted: () => refetch() });
    const [updateMemberRole] = useMutation(UPDATE_MEMBER_ROLE, { onCompleted: () => refetch() });

    const members: Membership[] = data?.allMemberships || [];

    const handleAddNewMember = async () => {
        if (!newMemberUsername) return;

        try {
            await addMember({
                variables: {
                    organisationId: orgId,
                    memberUsername: newMemberUsername,
                    makeAdmin: newMemberIsAdmin,
                },
            });
            setNewMemberUsername("");
            setNewMemberIsAdmin(false);
            refetch();
        } catch (err) {
            console.error(err);
            alert("Failed to add member");
        }
    };

    const handleToggleAdmin = async (m: Membership) => {
        try {
            await updateMemberRole({
                variables: {
                    organisationId: orgId,
                    memberId: m.user.id,
                    isOrgAdmin: !m.isOrgAdmin,
                },
            });
        } catch (err) {
            console.error(err);
            alert("Failed to update admin status");
        }
    };

    const handleRemoveMember = async (m: Membership) => {
        if (!confirm(`Remove ${m.user.username}?`)) return;

        try {
            await removeMember({
                variables: {
                    organisationId: orgId,
                    memberId: m.user.id,
                },
            });
        } catch (err) {
            console.error(err);
            alert("Failed to remove member");
        }
    };

    const filteredMembers = members.filter(
        (m) =>
            m.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Manage Organisation</h3>
                    <Button variant="secondary" size="sm" onClick={onClose}>
                        ✕ Close
                    </Button>
                </div>

                {/* Add Member Form */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-4">
                    <input
                        type="text"
                        placeholder="Username"
                        value={newMemberUsername}
                        onChange={(e) => setNewMemberUsername(e.target.value)}
                        className="border px-3 py-2 rounded-md flex-1 mb-2 sm:mb-0"
                    />
                    <label className="flex items-center space-x-1 mb-2 sm:mb-0">
                        <input
                            type="checkbox"
                            checked={newMemberIsAdmin}
                            onChange={(e) => setNewMemberIsAdmin(e.target.checked)}
                        />
                        <span>Make Admin</span>
                    </label>
                    <Button onClick={handleAddNewMember}>+ Add Member</Button>
                </div>

                {/* Search */}
                <input
                    type="text"
                    placeholder="Search members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
                />

                {/* Member List */}
                {loading ? (
                    <p className="text-gray-500">Loading members...</p>
                ) : error ? (
                    <p className="text-red-600">Failed to load members</p>
                ) : filteredMembers.length === 0 ? (
                    <p className="text-gray-500 text-center">No members found.</p>
                ) : (
                    <div className="space-y-3">
                        {filteredMembers.map((m) => (
                            <div
                                key={m.user.id}
                                className="flex justify-between items-center border p-3 rounded-lg hover:shadow-md transition-shadow duration-200"
                            >
                                <div>
                                    <p className="font-medium">{m.user.username}</p>
                                    <p className="text-sm text-gray-600">{m.user.email}</p>
                                </div>
                                <div className="flex space-x-2">
                                    {m.user.username !== user?.username && (
                                        <>
                                            <Button
                                                size="sm"
                                                variant={m.isOrgAdmin ? "primary" : "secondary"}
                                                onClick={() => handleToggleAdmin(m)}
                                            >
                                                {m.isOrgAdmin ? "Admin" : "Make Admin"}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="danger"
                                                onClick={() => handleRemoveMember(m)}
                                            >
                                                Remove
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageOrgPage;
