import React, { useState } from 'react';

interface ToggleSwitchProps {
    labelLeft: string;
    labelRight: string;
    onToggle: (isRight: boolean) => void;
    initialState?: boolean; // true for right, false for left
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ labelLeft, labelRight, onToggle, initialState = false }) => {
    const [isToggled, setIsToggled] = useState(initialState);

    const handleToggle = (newState: boolean) => {
        setIsToggled(newState);
        onToggle(newState);
    };

    return (
        <div className="flex items-center justify-center bg-gray-100 p-1 rounded-full shadow-inner select-none transition-colors duration-300">
      <span
          className={`px-4 py-2 text-sm font-semibold rounded-full cursor-pointer transition-all duration-300 ${
              !isToggled ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => handleToggle(false)}
      >
        {labelLeft}
      </span>
            <span
                className={`px-4 py-2 text-sm font-semibold rounded-full cursor-pointer transition-all duration-300 ${
                    isToggled ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => handleToggle(true)}
            >
        {labelRight}
      </span>
        </div>
    );
};

export default ToggleSwitch;