import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import * as garageApi from '../../api/garage';
import { toggleEngine, driveCar } from '../../api/engine';
import { deleteWinner, registerWin } from '../../api/winners';
import { generateRandomCars } from '../../utils/randomCar';
import {
  CARS_PER_PAGE,
  RANDOM_CARS_COUNT,
  DEFAULT_CAR_COLOR,
  MIN_ENGINE_DURATION_MS,
} from '../../utils/constants';
import type { Car, CreateCarPayload, CarAnimationState } from '../../types';

interface CarFormState {
  name: string;
  color: string;
}

interface Winner {
  id: number;
  name: string;
  time: number;
}

interface GarageState {
  cars: Car[];
  totalCount: number;
  page: number;
  selectedCarId: number | null;
  isRacing: boolean;
  animationState: Record<number, CarAnimationState>;
  carDurations: Record<number, number>;
  carStartTimestamps: Record<number, number>;
  carFrozenProgress: Record<number, number>;
  winner: Winner | null;
  loading: boolean;
  createForm: CarFormState;
  updateForm: CarFormState;
}

const emptyForm: CarFormState = { name: '', color: DEFAULT_CAR_COLOR };

const initialState: GarageState = {
  cars: [],
  totalCount: 0,
  page: 1,
  selectedCarId: null,
  isRacing: false,
  animationState: {},
  carDurations: {},
  carStartTimestamps: {},
  carFrozenProgress: {},
  winner: null,
  loading: false,
  createForm: { ...emptyForm },
  updateForm: { ...emptyForm },
};

type GarageRootState = { garage: GarageState };

export const loadCars = createAsyncThunk('garage/loadCars', async (page: number) => {
  const { cars, count } = await garageApi.fetchCars(page, CARS_PER_PAGE);
  return { cars, count, page };
});

export const addCar = createAsyncThunk(
  'garage/addCar',
  async (payload: CreateCarPayload, { dispatch, getState }) => {
    await garageApi.createCar(payload);
    const state = getState() as GarageRootState;
    await dispatch(loadCars(state.garage.page));
  },
);

export const editCar = createAsyncThunk(
  'garage/editCar',
  async ({ id, payload }: { id: number; payload: CreateCarPayload }, { dispatch, getState }) => {
    await garageApi.updateCar(id, payload);
    const state = getState() as GarageRootState;
    await dispatch(loadCars(state.garage.page));
  },
);

export const removeCar = createAsyncThunk(
  'garage/removeCar',
  async (id: number, { dispatch, getState }) => {
    await garageApi.deleteCar(id);
    await deleteWinner(id);

    const state = getState() as GarageRootState;
    const remainingOnPage = state.garage.cars.length - 1;
    const shouldGoBack = remainingOnPage === 0 && state.garage.page > 1;
    const nextPage = shouldGoBack ? state.garage.page - 1 : state.garage.page;

    await dispatch(loadCars(nextPage));
  },
);

export const createRandomCars = createAsyncThunk(
  'garage/createRandomCars',
  async (_: void, { dispatch, getState }) => {
    const randomCars = generateRandomCars(RANDOM_CARS_COUNT);
    await Promise.all(randomCars.map((car) => garageApi.createCar(car)));
    const state = getState() as GarageRootState;
    await dispatch(loadCars(state.garage.page));
  },
);

export const startCarEngine = createAsyncThunk(
  'garage/startCarEngine',
  async (id: number, { dispatch }) => {
    try {
      const { velocity, distance } = await toggleEngine(id, 'started');
      const duration = Math.max(MIN_ENGINE_DURATION_MS, Math.round(distance / velocity));
      const startedAt = Date.now();
      dispatch(beginDriving({ id, duration, startedAt }));

      const driveResult = await driveCar(id);
      if (!driveResult.success) {
        const elapsed = Date.now() - startedAt;
        const progress = Math.min(1, elapsed / duration);
        dispatch(freezeProgress({ id, progress }));
      }
    } catch {
      dispatch(freezeProgress({ id, progress: 0 }));
    }
  },
);

export const stopCarEngine = createAsyncThunk(
  'garage/stopCarEngine',
  async (id: number, { dispatch }) => {
    await toggleEngine(id, 'stopped');
    dispatch(resetCarToIdle(id));
  },
);

export const startRace = createAsyncThunk(
  'garage/startRace',
  async (_: void, { dispatch, getState }) => {
    dispatch(setRacing(true));
    dispatch(clearWinner());
    const state = getState() as GarageRootState;
    state.garage.cars.forEach((car) => {
      dispatch(startCarEngine(car.id));
    });
  },
);

export const resetRace = createAsyncThunk(
  'garage/resetRace',
  async (_: void, { dispatch, getState }) => {
    const state = getState() as GarageRootState;
    const ids = state.garage.cars.map((car) => car.id);
    await Promise.allSettled(ids.map((id) => toggleEngine(id, 'stopped')));
    dispatch(resetAnimations());
  },
);

export const carFinished = createAsyncThunk(
  'garage/carFinished',
  async ({ id, time }: { id: number; time: number }, { dispatch, getState }) => {
    const state = getState() as GarageRootState;
    if (state.garage.winner) {
      return;
    }
    const car = state.garage.cars.find((item) => item.id === id);
    if (!car) {
      return;
    }
    dispatch(setWinner({ id, name: car.name, time }));
    await registerWin(id, time);
  },
);

const garageSlice = createSlice({
  name: 'garage',
  initialState,
  reducers: {
    setSelectedCar(state, action: PayloadAction<number | null>) {
      state.selectedCarId = action.payload;
      state.updateForm = action.payload === null ? { ...emptyForm } : state.updateForm;
    },
    populateUpdateForm(state, action: PayloadAction<Car>) {
      state.selectedCarId = action.payload.id;
      state.updateForm = { name: action.payload.name, color: action.payload.color };
    },
    setCreateFormField(state, action: PayloadAction<Partial<CarFormState>>) {
      state.createForm = { ...state.createForm, ...action.payload };
    },
    setUpdateFormField(state, action: PayloadAction<Partial<CarFormState>>) {
      state.updateForm = { ...state.updateForm, ...action.payload };
    },
    resetCreateForm(state) {
      state.createForm = { ...emptyForm };
    },
    setAnimationState(state, action: PayloadAction<{ id: number; status: CarAnimationState }>) {
      state.animationState[action.payload.id] = action.payload.status;
    },
    beginDriving(
      state,
      action: PayloadAction<{ id: number; duration: number; startedAt: number }>,
    ) {
      const { id, duration, startedAt } = action.payload;
      state.animationState[id] = 'driving';
      state.carDurations[id] = duration;
      state.carStartTimestamps[id] = startedAt;
      delete state.carFrozenProgress[id];
    },
    freezeProgress(state, action: PayloadAction<{ id: number; progress: number }>) {
      state.animationState[action.payload.id] = 'broken';
      state.carFrozenProgress[action.payload.id] = action.payload.progress;
    },
    resetCarToIdle(state, action: PayloadAction<number>) {
      const id = action.payload;
      state.animationState[id] = 'idle';
      delete state.carDurations[id];
      delete state.carStartTimestamps[id];
      delete state.carFrozenProgress[id];
    },
    resetAnimations(state) {
      state.animationState = {};
      state.carDurations = {};
      state.carStartTimestamps = {};
      state.carFrozenProgress = {};
      state.winner = null;
      state.isRacing = false;
    },
    setRacing(state, action: PayloadAction<boolean>) {
      state.isRacing = action.payload;
    },
    setWinner(state, action: PayloadAction<Winner>) {
      state.winner = action.payload;
      state.isRacing = false;
    },
    clearWinner(state) {
      state.winner = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCars.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadCars.fulfilled, (state, action) => {
        state.cars = action.payload.cars;
        state.totalCount = action.payload.count;
        state.page = action.payload.page;
        state.loading = false;
      })
      .addCase(loadCars.rejected, (state) => {
        state.loading = false;
      })
      .addCase(removeCar.pending, (state, action) => {
        const deletedId = action.meta.arg;
        if (state.selectedCarId === deletedId) {
          state.selectedCarId = null;
          state.updateForm = { ...emptyForm };
        }
        delete state.animationState[deletedId];
        delete state.carDurations[deletedId];
        delete state.carStartTimestamps[deletedId];
        delete state.carFrozenProgress[deletedId];
      });
  },
});

export const {
  setSelectedCar,
  populateUpdateForm,
  setCreateFormField,
  setUpdateFormField,
  resetCreateForm,
  setAnimationState,
  beginDriving,
  freezeProgress,
  resetCarToIdle,
  resetAnimations,
  setRacing,
  setWinner,
  clearWinner,
} = garageSlice.actions;

export default garageSlice.reducer;