/** Single decoded field returned by the DecodeVin endpoint. */
export interface DecodeVinResult {
  Value: string | null;
  ValueId: string | null;
  Variable: string;
  VariableId: number;
}

/** Raw response shape of /vehicles/decodevin/{vin}?format=json */
export interface DecodeVinResponse {
  Count: number;
  Message: string;
  SearchCriteria: string;
  Results: DecodeVinResult[];
}

/** A single entry from /vehicles/getvehiclevariablelist?format=json */
export interface VehicleVariable {
  ID: number;
  Name: string;
  Description: string;
}

export interface VehicleVariableListResponse {
  Count: number;
  Message: string;
  Results: VehicleVariable[];
}

/** One entry stored in the "last 3 decodes" history. */
export interface DecodeHistoryEntry {
  vin: string;
  decodedAt: string;
  results: DecodeVinResult[];
}
