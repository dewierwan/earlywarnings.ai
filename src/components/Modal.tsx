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
        <p className="text-xl text-gray-800 mb-6 pr-8">{quote.text}</p>
        
        <div className="flex justify-between items-end">
          <div className="flex">
            {quote.image && (
              <div className="mr-4 flex-shrink-0">
                <img 
                  src={quote.image} 
                  alt={quote.author} 
                  className="w-24 h-24 object-cover rounded-md"
                  onError={(e) => {
                    console.error('Image failed to load:', quote.image);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
            
            <div className="flex-grow">
              <p className="text-lg text-indigo-600 font-medium">{quote.author}</p>
              <p className="text-sm text-gray-600">{quote.bio}</p>
            </div>
          </div>

          <a 
            href={quote.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-blue-500 hover:underline ml-4"
          >
            Source
          </a>
        </div>
      </div>
    </div>
  );
} 