// src/lib/sse.ts
import { temperatureData, powerData } from './stores';
import type { TemperaturePoint, PowerPoint } from './types';
import { updateCharts } from './charts';

const MAX_POINTS = 60;

export const listenToEvents = () => {
  const evtSource = new EventSource('http://localhost:3000/api/event');
  evtSource.onmessage = (event) => {
    const newData = JSON.parse(event.data);
    updateData(newData);
  };
}

const updateData = (newData: { time: string; temperatureC: number; powerKW: number }) => {
  temperatureData.update((data) => {
    const index = data.findIndex((d) => d.time === newData.time);
    if (index !== -1) data[index].temperatureC = newData.temperatureC;
    else data.push({ time: newData.time, temperatureC: newData.temperatureC });
    if (data.length > MAX_POINTS) data.shift();
    return [...data];
  });

  powerData.update((data) => {
    const index = data.findIndex((d) => d.time === newData.time);
    if (index !== -1) data[index].powerKW = newData.powerKW;
    else data.push({ time: newData.time, powerKW: newData.powerKW });
    if (data.length > MAX_POINTS) data.shift();
    return [...data];
  });

  // actualizar gráficos
  import('./stores').then(({ temperatureData, powerData }) => {
    let temp, power;
    temperatureData.subscribe(v => temp = v)();
    powerData.subscribe(v => power = v)();
    updateCharts(temp, power);
  });
}
