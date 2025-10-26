// src/lib/api.ts
import type { GetDataResponse } from './types';

export const loadInitialData = async(): Promise<GetDataResponse> => {
  const res = await fetch('http://localhost:3000/api/getData');
  if (!res.ok) throw new Error('Error al cargar los datos iniciales');
  return await res.json();
}
