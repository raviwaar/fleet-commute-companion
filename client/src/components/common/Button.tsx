export const Spinner: React.FC = () => (
    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'primary' | 'secondary' | 'danger';
    isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', isLoading = false, className = '', ...props }) => {
    const baseStyle = 'w-full py-2.5 px-4 font-semibold rounded-lg transition duration-150 ease-in-out flex items-center justify-center';
    const primaryStyle = 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/50 disabled:bg-indigo-400';
    const secondaryStyle = 'bg-indigo-100 hover:bg-indigo-200 text-indigo-800 disabled:bg-gray-200';

    return (
        <button
            className={`${baseStyle} ${variant === 'primary' ? primaryStyle : secondaryStyle} ${className}`}
            disabled={props.disabled || isLoading}
            {...props}
        >
            {isLoading ? <Spinner /> : children}
        </button>
    );
};
export default Button;