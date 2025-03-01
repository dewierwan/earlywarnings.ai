import { Quote } from '../data/quotes';
import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface ModalProps {
  quote: Quote | null;
  onClose: () => void;
}

export function Modal({ quote, onClose }: ModalProps) {
  if (!quote) return null;

  // Create ref for modal content to add focus trap and scrolling behavior
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle modal focus trap for accessibility and touch scrolling
  useEffect(() => {
    // Focus the modal when it opens
    if (modalRef.current) {
      modalRef.current.focus();
    }

    // Disable body scroll while modal is open
    document.body.style.overflow = 'hidden';
    
    // Handle ESC key to close modal
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    // Cleanup
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 backdrop-blur-sm z-50 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 max-w-2xl w-full relative shadow-2xl border border-gray-200 dark:border-gray-700 max-h-[90vh] sm:max-h-[85vh] overflow-y-auto my-4 sm:my-0"
        onClick={e => e.stopPropagation()}
        tabIndex={0}
      >
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 p-1 bg-gray-100 dark:bg-gray-700 rounded-full z-10"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>
        <p className="text-lg sm:text-xl text-gray-800 dark:text-gray-200 mb-6 pr-6 sm:pr-8" id="modal-title">{quote.text}</p>
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 sm:gap-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {quote.image && (
              <div className="flex-shrink-0 sm:mr-4">
                <img 
                  src={quote.image} 
                  alt={quote.author} 
                  className="w-16 h-16 sm:w-24 sm:h-24 object-cover rounded-md shadow-md"
                  onError={(e) => {
                    console.error('Image failed to load:', quote.image);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
            
            <div>
              <p className="text-md sm:text-lg text-indigo-600 dark:text-indigo-400 font-medium">{quote.author}</p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{quote.bio}</p>
            </div>
          </div>

          <a 
            href={quote.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-blue-500 dark:text-blue-400 hover:underline mt-2 sm:mt-0 sm:ml-4 inline-block"
          >
            Source
          </a>
        </div>
      </div>
    </div>
  );
}
