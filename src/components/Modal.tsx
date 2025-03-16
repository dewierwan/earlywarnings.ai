import { Quote } from '../data/quotes';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  quote: Quote | null;
  onClose: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
}

/**
 * Modal component using React.createPortal for better DOM placement
 */
export function Modal({ quote, onClose, onPrevious, onNext }: ModalProps) {
  if (!quote) return null;
  
  // Add event handler for Escape key only
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    
    // Cleanup function
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
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
          className="modal-content dark:bg-dark-card dark:border-dark-border"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 text-text-dark opacity-60 hover:opacity-90 dark:text-dark-text dark:opacity-60 dark:hover:opacity-90 p-1 bg-border-light dark:bg-dark-border rounded-full"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
          
          {/* Author header */}
          <div className="pb-4 border-b border-border-light dark:border-dark-border mb-4">
            <div className="flex items-start gap-6">
              {quote.image && (
                <div className="flex-shrink-0">
                  <img 
                    src={quote.image} 
                    alt={quote.author} 
                    className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-md shadow-md border border-border-light dark:border-dark-border"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              <div className="flex-1">
                <h2 className="text-[20px] text-accent-blue dark:text-white font-bold">
                  {quote.author}
                </h2>
                <p className="text-[14px] text-text-dark dark:text-dark-text mt-1 pr-6 font-medium">
                  {quote.bio}
                </p>
                <p className="text-[14px] text-text-dark opacity-75 dark:text-dark-text-secondary mt-1 font-medium">
                  {quote.year}
                </p>
              </div>
            </div>
          </div>
          
          {/* Quote text */}
          <div className="mb-5">
            <p className="text-[16px] text-text-dark dark:text-dark-text leading-relaxed font-normal" id="modal-title">
              {quote.text}
            </p>
          </div>
          
          {/* Footer with source link */}
          <div className="pt-3 border-t border-border-light dark:border-dark-border flex justify-end">
            <a 
              href={quote.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-accent-blue dark:text-dark-text hover:underline inline-flex items-center gap-1"
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
