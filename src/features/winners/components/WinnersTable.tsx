import type { JSX } from 'react';
import type { WinnerWithCar, SortField } from '../../../types';

interface WinnersTableProps {
  winners: WinnerWithCar[];
  page: number;
  itemsPerPage: number;
  sortBy: SortField;
  sortOrder: 'ASC' | 'DESC';
  onSort: (field: SortField) => void;
}

function getSortIndicator(field: SortField, sortBy: SortField, sortOrder: 'ASC' | 'DESC'): string {
  if (field !== sortBy) {
    return '';
  }
  return sortOrder === 'ASC' ? ' ▲' : ' ▼';
}

function WinnersTable({
  winners,
  page,
  itemsPerPage,
  sortBy,
  sortOrder,
  onSort,
}: WinnersTableProps): JSX.Element {
  const startingNumber = (page - 1) * itemsPerPage + 1;

  return (
    <table className="winners-table">
      <thead>
        <tr>
          <th>№</th>
          <th>Car</th>
          <th>Name</th>
          <th onClick={() => onSort('wins')} className="sortable">
            Wins{getSortIndicator('wins', sortBy, sortOrder)}
          </th>
          <th onClick={() => onSort('time')} className="sortable">
            Best time (s){getSortIndicator('time', sortBy, sortOrder)}
          </th>
        </tr>
      </thead>
      <tbody>
        {winners.map((winner, index) => (
          <tr key={winner.id}>
            <td>{startingNumber + index}</td>
            <td>
              <span
                className="car-icon-small"
                style={{ backgroundColor: winner.color }}
                aria-label={`Car color: ${winner.color}`}
                role="img"
              />
            </td>
            <td>{winner.name}</td>
            <td>{winner.wins}</td>
            <td>{winner.time.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default WinnersTable;
