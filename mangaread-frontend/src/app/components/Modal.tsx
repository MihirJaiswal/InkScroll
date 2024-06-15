// Modal.tsx

import React from 'react';

interface ModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="text-gray-800 mb-8">{message}</p>
        <div className="flex justify-end">
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mr-4"
            onClick={() => {
              onConfirm();
              onCancel();
            }}
          >
            Yes
          </button>
          <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded" onClick={onCancel}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
