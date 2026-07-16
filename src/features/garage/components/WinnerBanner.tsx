import type { JSX } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { clearWinner } from '../garageSlice';

function WinnerBanner(): JSX.Element | null {
  const dispatch = useAppDispatch();
  const winner = useAppSelector((state) => state.garage.winner);

  if (!winner) {
    return null;
  }

  const handleDismiss = (): void => {
    dispatch(clearWinner());
  };

  return (
    <div className="winner-banner">
      <span>
        🏆 {winner.name} won in {winner.time.toFixed(2)}s!
      </span>
      <button type="button" onClick={handleDismiss}>
        ×
      </button>
    </div>
  );
}

export default WinnerBanner;
