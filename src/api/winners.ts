import { WINNERS_ENDPOINT, TOTAL_COUNT_HEADER, HTTP_STATUS } from '../utils/constants';
import type { Winner, SortField, SortOrder } from '../types';

export interface WinnersResponse {
  winners: Winner[];
  count: number;
}

export async function fetchWinners(
  page: number,
  limit: number,
  sortBy: SortField,
  order: SortOrder,
): Promise<WinnersResponse> {
  const url = `${WINNERS_ENDPOINT}?_page=${page}&_limit=${limit}&_sort=${sortBy}&_order=${order}`;
  const response = await fetch(url);
  const winners: Winner[] = await response.json();
  const count = Number(response.headers.get(TOTAL_COUNT_HEADER)) || 0;
  return { winners, count };
}

export async function fetchWinnerById(id: number): Promise<Winner | null> {
  const response = await fetch(`${WINNERS_ENDPOINT}/${id}`);
  if (response.status === HTTP_STATUS.NOT_FOUND) {
    return null;
  }
  return response.json();
}

export async function createWinner(winner: Winner): Promise<Winner> {
  const response = await fetch(WINNERS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(winner),
  });
  return response.json();
}

export async function updateWinner(id: number, wins: number, time: number): Promise<Winner> {
  const response = await fetch(`${WINNERS_ENDPOINT}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ wins, time }),
  });
  return response.json();
}

export async function deleteWinner(id: number): Promise<void> {
  await fetch(`${WINNERS_ENDPOINT}/${id}`, { method: 'DELETE' });
}

/**
 * Increments wins and keeps the best (lowest) time, creating the record
 * if the car has never won before.
 */
export async function registerWin(id: number, time: number): Promise<void> {
  const existing = await fetchWinnerById(id);

  if (!existing) {
    await createWinner({ id, wins: 1, time });
    return;
  }

  const bestTime = time < existing.time ? time : existing.time;
  await updateWinner(id, existing.wins + 1, bestTime);
}
