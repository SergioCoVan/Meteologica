import reducer from "./main.reducer.js"

class MainController {

  // Obtiene los datos de la última hora, agrupados por minuto
  getData = async(req,res) => {
    try {
      console.log("Esperando coincidencia de hora...");
      const {lastHourTemperature, lastHourPower} = await reducer.waitForMatch(); // Espera hasta que haya match

      const reducedTemperature = reducer.reduceToMinutes(lastHourTemperature).map((d) => ({
        time: d.time,
        temperatureC: reducer.deciKelvinToCelsius(d.value),
      }));

      const reducedPower = reducer.reduceToMinutes(lastHourPower).map((d) => ({
        time: d.time,
        powerKW: reducer.mWToKW(d.value),
      }));

      res.status(200).json({
        message: "Coincidencia encontrada",
        temperature: reducedTemperature,
        power: reducedPower,
      });

    } catch (error) {
      res.status(408).json({ message: error.message });
    }
  }

  /*
    - Envía datos en tiempo real mediante Server-Sent Events (SSE).
    - Mantiene la conexión abierta con el cliente
    - Envía un nuevo promedio de datos cada 5 segundos
    - Si el cliente se desconecta, limpia el intervalo
   */
  sendEvents = (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders(); // Envía cabeceras inmediatamente

    console.log("Cliente SSE conectado");

    // Envía el primer paquete al conectar
    const firstData = reducer.getLastMinuteData();
    if (firstData) res.write(`data: ${JSON.stringify(firstData)}\n\n`);

    // Envía actualización cada 5 segundos
    const interval = setInterval(() => {
      const data = reducer.getLastMinuteData();
      if (data) res.write(`data: ${JSON.stringify(data)}\n\n`);
    }, 5000);

    // Si el cliente cierra la conexión
    req.on("close", () => {
      clearInterval(interval);
      console.log("Cliente SSE desconectado");
    });
  };
  
}

export default new MainController();