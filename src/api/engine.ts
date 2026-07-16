import { ENGINE_ENDPOINT, HTTP_STATUS } from '../utils/constants';
import type { EngineResponse, DriveResponse } from '../types';

export async function toggleEngine(
  id: number,
  status: 'started' | 'stopped',
): Promise<EngineResponse> {
  const response = await fetch(`${ENGINE_ENDPOINT}?id=${id}&status=${status}`, {
    method: 'PATCH',
  });

  if (!response.ok) {
    throw new Error(`Failed to set engine status "${status}" for car ${id}`);
  }

  return response.json();
}

/**
 * Returns success: false (instead of throwing) on a 500 "engine broke" response,
 * so callers can stop the animation without treating it as an unexpected error.
 * A 429 (already driving / rate limited) is not treated as a bug per task spec.
 */
export async function driveCar(id: number): Promise<DriveResponse> {
  const response = await fetch(`${ENGINE_ENDPOINT}?id=${id}&status=drive`, {
    method: 'PATCH',
  });

  if (response.status === HTTP_STATUS.SERVER_ERROR) {
    return { success: false };
  }

  if (response.status === HTTP_STATUS.TOO_MANY_REQUESTS) {
    return { success: false };
  }

  if (!response.ok) {
    throw new Error(`Unexpected drive error for car ${id}`);
  }

  return response.json();
}
