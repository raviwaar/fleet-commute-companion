export type View = "Home" | "Login" | "Register" | "Dashboard";
export type Role = "ORG_ADMIN" | "USER" | "GUEST";

export interface User {
    id: string;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    profileImage?: string;
    role?: Role;
    memberships?: OrganisationMembership[];
}

export interface Organisation {
    id: string;
    name?: string;
    slug?: string;
}

export interface OrganisationMembership {
    id: string;
    isOrgAdmin: boolean;
    organisation: Organisation;
}

export interface Membership {
    id: string;
    user: {
        id: string;
        username: string;
        email: string;
    };
    isOrgAdmin: boolean;
}


export interface AuthContextType {
    user: User | null;
    setUser: (user: User) => void;
    updateUser: (user: User) => void;
    token: string | null;
    currentView: View;
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    setCurrentView: (view: View) => void;
    isLoggedIn: boolean;
    //userRole: Role;
    //userId: string;
}
