export const VIN_MAX_LENGTH = 17;

/**
 * VINs use A–Z except I, O and Q (they're excluded to avoid confusion
 * with 1 and 0), plus digits 0–9.
 */
const ALLOWED_VIN_PATTERN = /^[A-HJ-NPR-Z0-9]*$/i;

export interface VinValidationResult {
  isValid: boolean;
  error: string | null;
}

/** Validates a VIN candidate before it is sent to the API. */
export function validateVin(rawVin: string): VinValidationResult {
  const vin = rawVin.trim();

  if (vin.length === 0) {
    return { isValid: false, error: "Введіть VIN-код." };
  }

  if (vin.length > VIN_MAX_LENGTH) {
    return {
      isValid: false,
      error: `VIN-код не може містити більше ${VIN_MAX_LENGTH} символів.`,
    };
  }

  if (!ALLOWED_VIN_PATTERN.test(vin)) {
    return {
      isValid: false,
      error: "VIN-код містить недопустимі символи (дозволені лише латинські літери, окрім I, O, Q, та цифри).",
    };
  }

  return { isValid: true, error: null };
}
