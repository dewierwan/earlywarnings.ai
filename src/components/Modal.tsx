import { Quote } from '../data/quotes';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  quote: Quote | null;
  onClose: () => void;
}

/**
 * Modal component using React.createPortal for better DOM placement
 */
export function Modal({ quote, onClose }: ModalProps) {
  if (!quote) return null;
  
  // Add event handler for escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    
    // Cleanup function
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const modalContent = (
    <>
      {/* Background overlay with onClick handler */}
      <div className="modal-overlay" onClick={onClose}></div>
      
      {/* Modal container with onClick handler that closes the modal */}
      <div className="modal-container" onClick={onClose}>
        {/* Modal content - stopping propagation to prevent container's onClick */}
        <div 
          className="modal-content dark:bg-gray-800 dark:border-gray-700"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 p-1 bg-gray-100 dark:bg-gray-700 rounded-full"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
          
          {/* Quote text */}
          <div className="pt-2 mb-6 pr-8">
            <p className="text-lg sm:text-xl text-gray-800 dark:text-gray-200" id="modal-title">
              {quote.text}
            </p>
          </div>
          
          {/* Author info and source link */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 sm:gap-6">
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
              {quote.image && (
                <div className="flex-shrink-0">
                  <img 
                    src={quote.image} 
                    alt={quote.author} 
                    className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 object-cover rounded-md shadow-md border border-gray-200 dark:border-gray-700"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              <div className="flex flex-col justify-center">
                <p className="text-md sm:text-lg md:text-xl text-indigo-600 dark:text-indigo-400 font-medium">
                  {quote.author}
                </p>
                <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-md">
                  {quote.bio}
                </p>
                <a 
                  href={quote.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 dark:text-blue-400 hover:underline mt-3 inline-block"
                >
                  Source
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // Use createPortal to render the modal at the end of the document body
  return createPortal(modalContent, document.body);
}
