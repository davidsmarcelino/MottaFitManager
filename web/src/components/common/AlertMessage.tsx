import React from 'react';

interface AlertMessageProps {
  type: 'error' | 'success';
  message: string;
  onClose?: () => void;
}

const AlertMessage: React.FC<AlertMessageProps> = ({ type, message, onClose }) => {
  if (!message) return null;

  const baseClasses = "px-4 py-3 rounded-lg mb-4 flex justify-between items-center";
  const typeClasses = type === 'error' 
    ? "bg-red-50 border border-red-200 text-red-700"
    : "bg-green-50 border border-green-200 text-green-700";

  return (
    <div className={`${baseClasses} ${typeClasses}`}>
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} className="ml-2 text-sm font-bold">
          ×
        </button>
      )}
    </div>
  );
};

export { AlertMessage };