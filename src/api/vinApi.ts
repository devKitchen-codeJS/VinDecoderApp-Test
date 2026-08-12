import type {
  DecodeVinResponse,
  VehicleVariable,
  VehicleVariableListResponse,
} from "../types/vin";

const BASE_URL = "https://vpic.nhtsa.dot.gov/api/vehicles";

export class VinApiError extends Error {}

/** Decodes a single VIN via the DecodeVin endpoint. */
export async function decodeVin(vin: string): Promise<DecodeVinResponse> {
  const url = `${BASE_URL}/decodevin/${encodeURIComponent(vin)}?format=json`;

  let response: Response;
  try {
    response = await fetch(url);
  } catch {
    throw new VinApiError("Не вдалося з'єднатися з сервісом NHTSA. Перевірте інтернет-з'єднання.");
  }

  if (!response.ok) {
    throw new VinApiError(`Сервіс NHTSA повернув помилку (код ${response.status}).`);
  }

  const data = (await response.json()) as DecodeVinResponse;
  return data;
}

// Module-level cache: the variable list rarely changes, so we fetch it once.
let variablesCache: VehicleVariable[] | null = null;
let variablesPromise: Promise<VehicleVariable[]> | null = null;

/** Fetches the full list of vPIC vehicle variables (cached after first call). */
export async function getVehicleVariablesList(): Promise<VehicleVariable[]> {
  if (variablesCache) return variablesCache;
  if (variablesPromise) return variablesPromise;

  variablesPromise = (async () => {
    const url = `${BASE_URL}/getvehiclevariablelist?format=json`;

    let response: Response;
    try {
      response = await fetch(url);
    } catch {
      throw new VinApiError("Не вдалося з'єднатися з сервісом NHTSA. Перевірте інтернет-з'єднання.");
    }

    if (!response.ok) {
      throw new VinApiError(`Сервіс NHTSA повернув помилку (код ${response.status}).`);
    }

    const data = (await response.json()) as VehicleVariableListResponse;
    variablesCache = data.Results;
    return data.Results;
  })();

  try {
    return await variablesPromise;
  } finally {
    variablesPromise = null;
  }
}

/** Finds a single variable's description by its numeric ID (uses the cached list). */
export async function getVehicleVariableById(
  id: number
): Promise<VehicleVariable | undefined> {
  const list = await getVehicleVariablesList();
  return list.find((item) => item.ID === id);
}
