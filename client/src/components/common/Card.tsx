import React, { ReactNode } from "react";

interface CardProps {
    title?: string;
    children: ReactNode;
    className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className = "" }) => {
    return (
        <div
            className={`bg-white rounded-2xl shadow-lg p-6 w-full max-w-md ${className}`}
        >
            {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
            {children}
        </div>
    );
};

export default Card;
