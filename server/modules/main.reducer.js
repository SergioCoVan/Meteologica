import yaml from "js-yaml";
import fs from "fs";

// Cargamos los datos simulados de temperatura y potencia desde un archivo YAML
const data = yaml.load(fs.readFileSync("../data.yml", "utf8"));
const temperatureValues = data.temperature.values;
const powerValues = data.power.values;

class MainReducer {
  // Convierte deciKelvin (dK) a Celsius
  deciKelvinToCelsius = (dK) => {
    return dK / 10 - 273.15;
  }

  //Convertir MW a KW
  mWToKW = (mW) => {
    return mW * 1000;
  }

  // Devuelve la hora actual en formato "HH:MM:SS"
  getCurrentTimeString = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`; // "HH:MM:SS"
  }

  // Espera a que la hora actual coincida con una que contenga el archivo data.yml
  waitForMatch = async() => {
    return new Promise((resolve, reject) => {
      const maxWait = 60 * 1000; // tiempo máximo de espera: 60s
      const startTime = Date.now();

      const interval = setInterval(() => {
        const currentTime = this.getCurrentTimeString();
        const matchTemperatureIndex = temperatureValues.findIndex(elem => elem.time === currentTime);
        const matchPowerIndex = powerValues.findIndex(elem => elem.time === currentTime);

        if (matchTemperatureIndex !== -1 && matchPowerIndex !== -1) {
          clearInterval(interval);
          // Obtener los últimos 720 registros (~1 hora)
          const startTemperature = Math.max(0, matchTemperatureIndex - 719);
          const startPower = Math.max(0, matchPowerIndex - 719);

          const lastHourTemperature = temperatureValues.slice(startTemperature, matchTemperatureIndex + 1);
          const lastHourPower = powerValues.slice(startPower, matchPowerIndex + 1);

          resolve({lastHourTemperature, lastHourPower});

        } else if (Date.now() - startTime > maxWait) {
          clearInterval(interval);
          reject(new Error("Timeout esperando coincidencia de hora."));
        }
      }, 1000);
    });
  }

  // Agrupa los valores por minuto y calcula la media de cada minuto
  // Devuelve la última hora (60 registros)
  reduceToMinutes = (data) => {
    const grouped = {};

    for (const { time, value } of data) {
      const minute = time.slice(0, 5); // "HH:MM"
      const numericValue = parseFloat(value);
      if (!grouped[minute]) grouped[minute] = { sum: 0, count: 0 };
      grouped[minute].sum += numericValue;
      grouped[minute].count++;
    }

    const averaged = Object.entries(grouped).map(([minute, { sum, count }]) => ({
      time: `${minute}:00`,
      value: sum / count,
    }));

    averaged.sort((a, b) => a.time.localeCompare(b.time));
    return averaged.slice(-60);
  }


  getLastMinuteData = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = now.getSeconds();

    // Redondeamos hacia abajo al múltiplo de 5 más cercano
    const maxSecond = Math.floor(seconds / 5) * 5;
    const endSecond = String(maxSecond).padStart(2, "0");

    const prefix = `${hours}:${minutes}:`; // "HH:MM:"

    // Filtramos solo desde :00 hasta el segundo actual redondeado (inclusive)
    const tempData = temperatureValues.filter(
      (d) => d.time >= `${prefix}00` && d.time <= `${prefix}${endSecond}`
    );
    const powerData = powerValues.filter(
      (d) => d.time >= `${prefix}00` && d.time <= `${prefix}${endSecond}`
    );

    // Si no hay datos aún para este minuto (por ejemplo segundos < 5 y no hay :00),
    // devolvemos null para indicar que no hay valor válido todavía.
    if (!tempData.length || !powerData.length) return null;

    // Aseguramos que sumamos números (parseFloat/Number por si vienen como string)
    const tempSum = tempData.reduce((acc, d) => acc + Number(d.value), 0);
    const powerSum = powerData.reduce((acc, d) => acc + Number(d.value), 0);

    const tempAvg = tempSum / tempData.length;
    const powerAvg = powerSum / powerData.length;

    return {
      time: `${hours}:${minutes}:00`, // timestamp representativo del minuto
      temperatureC: this.deciKelvinToCelsius(tempAvg),
      powerKW: this.mWToKW(powerAvg),
    };
  }
}

export default new MainReducer();