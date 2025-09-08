// src/interfaces/ApiResponse.ts
export interface ApiResponse<T = unknown> {
  success: boolean;
  status: number; // mejor número que string
  message: string;
  details?: string;
  content?: T; // puede ser objeto, array, etc.
}
