import type { CreateCarPayload } from '../types';

const BRANDS = [
  'Tesla',
  'Ford',
  'Toyota',
  'BMW',
  'Audi',
  'Honda',
  'Chevrolet',
  'Nissan',
  'Mazda',
  'Kia',
];

const MODELS = [
  'Model S',
  'Mustang',
  'Corolla',
  'M3',
  'A4',
  'Civic',
  'Camaro',
  'GT-R',
  'MX-5',
  'Sportage',
];

function getRandomItem<T>(items: T[]): T {
  const index = Math.floor(Math.random() * items.length);
  return items[index];
}

function getRandomColor(): string {
  const red = Math.floor(Math.random() * 256);
  const green = Math.floor(Math.random() * 256);
  const blue = Math.floor(Math.random() * 256);
  return `rgb(${red}, ${green}, ${blue})`;
}

export function generateRandomCar(): CreateCarPayload {
  const brand = getRandomItem(BRANDS);
  const model = getRandomItem(MODELS);
  return {
    name: `${brand} ${model}`,
    color: getRandomColor(),
  };
}

export function generateRandomCars(count: number): CreateCarPayload[] {
  return Array.from({ length: count }, () => generateRandomCar());
}
