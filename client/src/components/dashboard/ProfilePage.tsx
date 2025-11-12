import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useQuery, useMutation } from "@apollo/client";
import { UPDATE_USER_PROFILE } from "../../graphql/mutations/authMutations";
import { GET_CURRENT_USER } from "../../graphql/queries/meQuery";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

interface ProfilePageProps {
    onClose: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onClose }) => {
    const { updateUser: updateUserStorage } = useAuth();
    const { data, loading: meLoading, error: meError } = useQuery(GET_CURRENT_USER);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [profileImage, setProfileImage] = useState("");

    const [updateProfile, { loading: updateLoading, error: updateError }] = useMutation(UPDATE_USER_PROFILE);

    useEffect(() => {
        if (data?.me) {
            const user = data.me;
            setFirstName(user.firstName || "");
            setLastName(user.lastName || "");
            setPhoneNumber(user.phoneNumber || "");
            setProfileImage(user.profileImage || "");
        }
    }, [data]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { data: updatedData } = await updateProfile({
                variables: { firstName, lastName, phoneNumber, profileImage },
            });

            const updatedUser = updatedData.updateUser.user;
            if (updatedUser) {
                updateUserStorage(updatedUser);
                alert("Profile updated successfully!");
                onClose();
            }
        } catch (err) {
            console.error(err);
            alert("Failed to update profile");
        }
    };

    if (meLoading) return <p>Loading profile...</p>;
    if (meError) return <p className="text-red-500">Error loading profile</p>;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={onClose} // click outside closes modal
        >
            <div
                className="bg-white rounded-2xl shadow-lg w-[400px] max-w-full p-6 relative"
                onClick={(e) => e.stopPropagation()} // prevent click inside modal from closing
            >
                <h2 className="text-xl font-semibold mb-4 text-center">Update Profile</h2>

                {/* Profile Image */}
                {profileImage && (
                    <div className="flex justify-center mb-4">
                        <img
                            src={profileImage}
                            alt="Profile"
                            className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
                        />
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        id="firstName"
                        label="First Name"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <Input
                        id="lastName"
                        label="Last Name"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                    <Input
                        id="phoneNumber"
                        label="Phone Number"
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    <Input
                        id="profileImage"
                        label="Profile Image URL"
                        type="text"
                        value={profileImage}
                        onChange={(e) => setProfileImage(e.target.value)}
                    />

                    {updateError && (
                        <p className="text-red-600 text-sm text-center">Failed to update profile</p>
                    )}

                    <div className="flex justify-between items-center">
                        <Button type="submit" isLoading={updateLoading}>
                            Save
                        </Button>
                        <Button type="button" variant="secondary" onClick={onClose}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;
