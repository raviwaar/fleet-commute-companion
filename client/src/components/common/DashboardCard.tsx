interface DashboardCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    onClick: () => void;
    className?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ icon, title, description, onClick, className }) => (
    <div
        className={`bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-200 ease-in-out cursor-pointer transform hover:-translate-y-1 ${className}`}
        onClick={onClick}
    >
        <div className="flex items-center space-x-4">
            <div className="text-indigo-600 text-3xl">{icon}</div>
            <div>
                <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                <p className="text-gray-500 text-sm">{description}</p>
            </div>
        </div>
    </div>
);

export default DashboardCard;