import type { JSX } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { startRace, resetRace, createRandomCars } from '../garageSlice';

function RaceControls(): JSX.Element {
  const dispatch = useAppDispatch();
  const isRacing = useAppSelector((state) => state.garage.isRacing);
  const carCount = useAppSelector((state) => state.garage.cars.length);

  const handleStartRace = (): void => {
    dispatch(startRace());
  };

  const handleResetRace = (): void => {
    dispatch(resetRace());
  };

  const handleCreateRandomCars = (): void => {
    dispatch(createRandomCars());
  };

  return (
    <div className="race-controls">
      <button type="button" onClick={handleStartRace} disabled={isRacing || carCount === 0}>
        Race
      </button>
      <button type="button" onClick={handleResetRace}>
        Reset
      </button>
      <button type="button" onClick={handleCreateRandomCars} disabled={isRacing}>
        Generate Cars
      </button>
    </div>
  );
}

export default RaceControls;
