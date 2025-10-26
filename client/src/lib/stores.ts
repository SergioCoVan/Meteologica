// src/lib/stores.ts
import { writable } from 'svelte/store';
import type { TemperaturePoint, PowerPoint } from './types';

export const temperatureData = writable<TemperaturePoint[]>([]);
export const powerData = writable<PowerPoint[]>([]);
