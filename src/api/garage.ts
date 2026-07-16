import { GARAGE_ENDPOINT, TOTAL_COUNT_HEADER } from '../utils/constants';
import type { Car, CreateCarPayload } from '../types';

export interface CarsResponse {
  cars: Car[];
  count: number;
}

export async function fetchCars(page: number, limit: number): Promise<CarsResponse> {
  const response = await fetch(`${GARAGE_ENDPOINT}?_page=${page}&_limit=${limit}`);
  const cars: Car[] = await response.json();
  const count = Number(response.headers.get(TOTAL_COUNT_HEADER)) || 0;
  return { cars, count };
}

export async function fetchCar(id: number): Promise<Car> {
  const response = await fetch(`${GARAGE_ENDPOINT}/${id}`);
  return response.json();
}

export async function createCar(payload: CreateCarPayload): Promise<Car> {
  const response = await fetch(GARAGE_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return response.json();
}

export async function updateCar(id: number, payload: CreateCarPayload): Promise<Car> {
  const response = await fetch(`${GARAGE_ENDPOINT}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return response.json();
}

export async function deleteCar(id: number): Promise<void> {
  await fetch(`${GARAGE_ENDPOINT}/${id}`, { method: 'DELETE' });
}
