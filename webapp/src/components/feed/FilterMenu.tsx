import React from 'react';
import '../../styles/FilterMenu.css';

export type OrderByOption = 'RELEVANCE' | 'UPVOTES_DESC' | 'UPVOTES_ASC' | 'DATE_DESC' | 'DATE_ASC';

interface FilterMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentOrder: OrderByOption;
  onOrderChange: (order: OrderByOption) => void;
}

export default function FilterMenu({ 
  isOpen, 
  onClose, 
  currentOrder, 
  onOrderChange 
}: FilterMenuProps) {
  if (!isOpen) return null;

  const handleRelevanceClick = () => {
    onOrderChange('RELEVANCE');
    onClose();
  };

  const handleVotesClick = () => {
    const newOrder = currentOrder === 'UPVOTES_DESC' ? 'UPVOTES_ASC' : 'UPVOTES_DESC';
    onOrderChange(newOrder);
    onClose();
  };

  const handleDateClick = () => {
    const newOrder = currentOrder === 'DATE_DESC' ? 'DATE_ASC' : 'DATE_DESC';
    onOrderChange(newOrder);
    onClose();
  };

  const isVotesActive = currentOrder === 'UPVOTES_DESC' || currentOrder === 'UPVOTES_ASC';
  const isDateActive = currentOrder === 'DATE_DESC' || currentOrder === 'DATE_ASC';

  return (
    <>
      <div className="filter-menu-overlay" onClick={onClose} />
      <div className="filter-menu">
        <button
          className={`filter-option ${currentOrder === 'RELEVANCE' ? 'active' : ''}`}
          onClick={handleRelevanceClick}
        >
          <svg 
            className="filter-icon" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span>Relevância</span>
        </button>

        <button
          className={`filter-option ${isVotesActive ? 'active' : ''}`}
          onClick={handleVotesClick}
        >
          <svg 
            className="filter-icon" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            {currentOrder === 'UPVOTES_DESC' ? (
              <path d="M12 19V5M5 12l7-7 7 7" />
            ) : (
              <path d="M12 5v14M5 12l7 7 7-7" />
            )}
          </svg>
          <span>
            {currentOrder === 'UPVOTES_DESC' ? 'Mais votados' : 
             currentOrder === 'UPVOTES_ASC' ? 'Menos votados' : 
             'Votos'}
          </span>
        </button>

        <button
          className={`filter-option ${isDateActive ? 'active' : ''}`}
          onClick={handleDateClick}
        >
          <svg 
            className="filter-icon" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            {currentOrder === 'DATE_DESC' ? (
              <path d="M12 5v14M19 12l-7 7-7-7" />
            ) : (
              <path d="M12 19V5M5 12l7-7 7 7" />
            )}
          </svg>
          <span>
            {currentOrder === 'DATE_DESC' ? 'Mais recentes' : 
             currentOrder === 'DATE_ASC' ? 'Mais antigos' : 
             'Data'}
          </span>
        </button>
      </div>
    </>
  );
}

export function getFilterLabel(orderBy: OrderByOption): string {
  switch (orderBy) {
    case 'RELEVANCE':
      return 'Relevância';
    case 'UPVOTES_DESC':
      return 'Mais votados';
    case 'UPVOTES_ASC':
      return 'Menos votados';
    case 'DATE_DESC':
      return 'Mais recentes';
    case 'DATE_ASC':
      return 'Mais antigos';
    default:
      return 'Filtros';
  }
}