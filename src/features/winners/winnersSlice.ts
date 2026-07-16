import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import * as winnersApi from '../../api/winners';
import { fetchCar } from '../../api/garage';
import { WINNERS_PER_PAGE } from '../../utils/constants';
import type { WinnerWithCar, SortField, SortOrder } from '../../types';

interface WinnersState {
  winners: WinnerWithCar[];
  totalCount: number;
  page: number;
  sortBy: SortField;
  sortOrder: SortOrder;
  loading: boolean;
}

const initialState: WinnersState = {
  winners: [],
  totalCount: 0,
  page: 1,
  sortBy: 'id',
  sortOrder: 'ASC',
  loading: false,
};

export const loadWinners = createAsyncThunk(
  'winners/loadWinners',
  async (_: void, { getState }) => {
    const state = getState() as { winners: WinnersState };
    const { page, sortBy, sortOrder } = state.winners;

    const { winners, count } = await winnersApi.fetchWinners(
      page,
      WINNERS_PER_PAGE,
      sortBy,
      sortOrder,
    );

    const winnersWithCars: WinnerWithCar[] = await Promise.all(
      winners.map(async (winner) => {
        const car = await fetchCar(winner.id);
        return { ...winner, name: car.name, color: car.color };
      }),
    );

    return { winners: winnersWithCars, count };
  },
);

const winnersSlice = createSlice({
  name: 'winners',
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setSort(state, action: PayloadAction<SortField>) {
      if (state.sortBy === action.payload) {
        state.sortOrder = state.sortOrder === 'ASC' ? 'DESC' : 'ASC';
      } else {
        state.sortBy = action.payload;
        state.sortOrder = 'ASC';
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadWinners.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadWinners.fulfilled, (state, action) => {
        state.winners = action.payload.winners;
        state.totalCount = action.payload.count;
        state.loading = false;
      })
      .addCase(loadWinners.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setPage, setSort } = winnersSlice.actions;
export default winnersSlice.reducer;
