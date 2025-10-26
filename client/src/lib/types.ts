export interface TemperaturePoint {
  time: string;
  temperatureC: number;
}

export interface PowerPoint {
  time: string;
  powerKW: number;
}

export interface GetDataResponse {
  message: string;
  temperature: TemperaturePoint[];
  power: PowerPoint[];
}
