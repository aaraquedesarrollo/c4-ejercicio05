require("dotenv").config();
const express = require("express");
const chalk = require("chalk");
const morganFreeman = require("morgan");
const { obtenerLineas, obtenerParadasLinea } = require("./llamadasApi");

const app = express();
const puerto = process.env.PUERTO;

let lineasMetro = null;

app.listen(puerto, () =>
  console.log(chalk.yellow(`Servidor abierto en el puerto ${puerto}`))
);

app.use(morganFreeman("dev"));
app.use(express.static("public"));
app.use(express.json());

app.use((req, res, next) => {
  if (
    req.method === "PUT" ||
    req.method === "POST" ||
    req.method === "DELETE"
  ) {
    res
      .status(403)
      .json({ error: true, mensaje: "Te pensabas que podías jaquearme" });
  } else {
    next();
  }
});

app.get("/metro/lineas", async (req, res, next) => {
  lineasMetro = await obtenerLineas();
  const datosFormateados = lineasMetro.map((lineaMetro) => ({
    id: lineaMetro.properties.CODI_LINIA,
    linea: lineaMetro.properties.NOM_LINIA,
    descripcion: lineaMetro.properties.DESC_LINIA,
  }));
  res.json(datosFormateados);
});

app.get("/metro/linea/:nombreLinea", async (req, res, next) => {
  const { nombreLinea } = req.params;
  if (lineasMetro === null) {
    lineasMetro = await obtenerLineas();
  }
  const lineaEncontrada = lineasMetro.find(
    (linea) =>
      linea.properties.NOM_LINIA.toLowerCase() === nombreLinea.toLowerCase()
  );
  if (!lineaEncontrada) {
    res.json({ error: true, mensaje: "No existe la linea buscada" });
  }
  const { features: paradasLinea } = await obtenerParadasLinea(
    lineaEncontrada.properties.CODI_LINIA
  );
  res.json({
    linea: lineaEncontrada.properties.NOM_LINIA,
    descripcion: lineaEncontrada.properties.DESC_LINIA,
    paradas: paradasLinea.map(
      ({ properties: { ID_ESTACIO, NOM_ESTACIO } }) => ({
        id: ID_ESTACIO,
        nombre: NOM_ESTACIO,
      })
    ),
  });
});

app.use((req, res, next) => {
  res.status(404).json({ error: true, mensaje: "Recurso no encontrado" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: true, mensaje: "Error general" });
});
