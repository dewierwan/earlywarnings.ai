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
          
          {/* Author header */}
          <div className="pb-4 border-b border-gray-200 dark:border-gray-700 mb-4">
            <div className="flex items-start gap-6">
              {quote.image && (
                <div className="flex-shrink-0">
                  <img 
                    src={quote.image} 
                    alt={quote.author} 
                    className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-md shadow-md border border-gray-200 dark:border-gray-700"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              <div className="flex-1">
                <h2 className="text-lg sm:text-xl md:text-2xl text-indigo-600 dark:text-indigo-400 font-medium">
                  {quote.author}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 pr-6">
                  {quote.bio}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">
                  {quote.year}
                </p>
              </div>
            </div>
          </div>
          
          {/* Quote text */}
          <div className="max-h-[40vh] overflow-y-auto mb-5 custom-scrollbar">
            <p className="text-lg sm:text-xl text-gray-800 dark:text-gray-100" id="modal-title">
              {quote.text}
            </p>
          </div>
          
          {/* Footer with source link */}
          <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-end">
            <a 
              href={quote.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-blue-500 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
            >
              View Source
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                <path d="M7 7l9.2 9.2M17 7v10H7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </>
  );

  // Use createPortal to render the modal at the end of the document body
  return createPortal(modalContent, document.body);
}
