const fetch = require("node-fetch");
require("dotenv").config();

const urlAPI = process.env.URL_API;
const paradasEndPoint = process.env.PARADAS_ENDPOINT;
const apiAuth = `?app_id=${process.env.APP_ID}&app_key=${process.env.APP_KEY}`;

const obtenerLineas = async () => {
  const resp = await fetch(`${urlAPI}${apiAuth}`);
  const { features } = await resp.json();
  return features;
};

const obtenerParadasLinea = async (codiLinia) => {
  const resp = await fetch(
    `${paradasEndPoint}${codiLinia}/estacions${apiAuth}`
  );
  if (resp.ok) {
    const paradas = await resp.json();
    return paradas;
  }
};

module.exports = {
  obtenerLineas,
  obtenerParadasLinea,
};
