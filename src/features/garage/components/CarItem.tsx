import { useEffect, useRef, useState } from 'react';
import type { JSX, CSSProperties } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  startCarEngine,
  stopCarEngine,
  removeCar,
  populateUpdateForm,
  carFinished,
  setAnimationState,
} from '../garageSlice';
import { MS_PER_SECOND } from '../../../utils/constants';
import type { Car } from '../../../types';

interface CarItemProps {
  car: Car;
}

function getProgress(
  status: string,
  startedAt: number | undefined,
  duration: number,
  frozenProgress: number | undefined,
): number {
  if (status === 'driving' && startedAt !== undefined && duration > 0) {
    return Math.min(1, (Date.now() - startedAt) / duration);
  }
  if (status === 'finished') {
    return 1;
  }
  if (status === 'broken') {
    return frozenProgress ?? 0;
  }
  return 0;
}

function CarItem({ car }: CarItemProps): JSX.Element {
  const dispatch = useAppDispatch();
  const [, forceRerender] = useState(0);

  const animationFrameRef = useRef<number | null>(null);
  const hasFinishedRef = useRef(false);

  const status = useAppSelector((state) => state.garage.animationState[car.id] ?? 'idle');
  const duration = useAppSelector((state) => state.garage.carDurations[car.id] ?? 0);
  const startedAt = useAppSelector((state) => state.garage.carStartTimestamps[car.id]);
  const frozenProgress = useAppSelector((state) => state.garage.carFrozenProgress[car.id]);
  const isSelected = useAppSelector((state) => state.garage.selectedCarId === car.id);
  const isRacing = useAppSelector((state) => state.garage.isRacing);

  const isStartDisabled = status !== 'idle';
  const isStopDisabled = status === 'idle';
  const isControlDisabled = isRacing;

  const handleStart = (): void => {
    dispatch(startCarEngine(car.id));
  };

  const handleStop = (): void => {
    dispatch(stopCarEngine(car.id));
  };

  const handleSelect = (): void => {
    dispatch(populateUpdateForm(car));
  };

  const handleDelete = (): void => {
    dispatch(removeCar(car.id));
  };

  useEffect(() => {
    const stopLoop = (): void => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };

    if (status !== 'driving' || duration <= 0 || startedAt === undefined) {
      stopLoop();
      return stopLoop;
    }

    hasFinishedRef.current = false;

    const tick = (): void => {
      const ratio = Math.min(1, (Date.now() - startedAt) / duration);
      forceRerender((count) => count + 1);

      if (ratio >= 1) {
        if (!hasFinishedRef.current) {
          hasFinishedRef.current = true;
          dispatch(setAnimationState({ id: car.id, status: 'finished' }));
          dispatch(carFinished({ id: car.id, time: duration / MS_PER_SECOND }));
        }
        return;
      }

      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);

    return stopLoop;
  }, [status, duration, startedAt, car.id, dispatch]);

  const progress = getProgress(status, startedAt, duration, frozenProgress);

  const carIconStyle: CSSProperties = {
    backgroundColor: car.color,
    left: `calc(${progress * 100}% - ${progress * 50}px)`,
  };

  return (
    <div className={`car-item ${isSelected ? 'car-item--selected' : ''}`}>
      <div className="car-controls">
        <button type="button" onClick={handleSelect} disabled={isControlDisabled}>
          Select
        </button>
        <button type="button" onClick={handleDelete} disabled={isControlDisabled}>
          Remove
        </button>
        <button type="button" onClick={handleStart} disabled={isStartDisabled}>
          Start
        </button>
        <button type="button" onClick={handleStop} disabled={isStopDisabled}>
          Stop
        </button>
        <span className="car-name">{car.name}</span>
      </div>
      <div className="car-track">
        <div className="car-icon" style={carIconStyle} />
        <div className="finish-line" />
      </div>
    </div>
  );
}

export default CarItem;