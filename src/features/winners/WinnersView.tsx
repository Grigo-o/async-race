import { useEffect } from 'react';
import type { JSX } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { loadWinners, setPage, setSort } from './winnersSlice';
import WinnersTable from './components/WinnersTable';
import Pagination from '../../components/Pagination';
import { WINNERS_PER_PAGE } from '../../utils/constants';
import type { SortField } from '../../types';
import './winners.css';

function WinnersView(): JSX.Element {
  const dispatch = useAppDispatch();
  const { winners, totalCount, page, sortBy, sortOrder, loading } = useAppSelector(
    (state) => state.winners,
  );

  useEffect(() => {
    dispatch(loadWinners());
  }, [dispatch, page, sortBy, sortOrder]);

  const handlePageChange = (nextPage: number): void => {
    dispatch(setPage(nextPage));
  };

  const handleSort = (field: SortField): void => {
    dispatch(setSort(field));
  };

  return (
    <section className="winners-view">
      <h1>Winners</h1>
      <p className="winner-count">Total winners: {totalCount}</p>

      {loading && <p>Loading...</p>}
      {!loading && winners.length === 0 && <p className="empty-message">No winners yet</p>}

      {winners.length > 0 && (
        <WinnersTable
          winners={winners}
          page={page}
          itemsPerPage={WINNERS_PER_PAGE}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
        />
      )}

      <Pagination
        currentPage={page}
        totalItems={totalCount}
        itemsPerPage={WINNERS_PER_PAGE}
        onPageChange={handlePageChange}
      />
    </section>
  );
}

export default WinnersView;
