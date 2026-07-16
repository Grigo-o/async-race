export const BASE_URL = 'http://127.0.0.1:3000';

export const GARAGE_ENDPOINT = `${BASE_URL}/garage`;
export const ENGINE_ENDPOINT = `${BASE_URL}/engine`;
export const WINNERS_ENDPOINT = `${BASE_URL}/winners`;

export const CARS_PER_PAGE = 7;
export const WINNERS_PER_PAGE = 10;
export const RANDOM_CARS_COUNT = 100;

export const MAX_CAR_NAME_LENGTH = 30;
export const DEFAULT_CAR_COLOR = '#ffffff';
export const MIN_ENGINE_DURATION_MS = 1;
export const MS_PER_SECOND = 1000;
export const SCORE_DECIMAL_PLACES = 2;

export const TOTAL_COUNT_HEADER = 'X-Total-Count';

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  SERVER_ERROR: 500,
} as const;

export const TRACK_WIDTH_PADDING_PX = 120;
