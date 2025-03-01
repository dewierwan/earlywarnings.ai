import React from 'react';
import { Quote } from '../data/quotes';
import { X } from 'lucide-react';

interface ModalProps {
  quote: Quote | null;
  onClose: () => void;
}

export function Modal({ quote, onClose }: ModalProps) {
  if (!quote) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg p-6 max-w-2xl w-full relative shadow-2xl border border-gray-200"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>
        <p className="text-xl text-gray-800 mb-4 pr-8">{quote.text}</p>
        <p className="text-lg text-indigo-600 font-medium mb-2">{quote.author}</p>
        <p className="text-sm text-gray-600 mb-4">{quote.bio}</p>
        <a 
          href={quote.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-blue-500 hover:underline"
        >
          Source
        </a>
      </div>
    </div>
  );
} 