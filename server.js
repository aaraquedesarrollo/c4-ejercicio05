const express = require("express");
const chalk = require("chalk");

const app = express();
const puerto = process.env.PUERTO;

app.listen(puerto, () =>
  console.log(chalk.yellow("Servidor abierto en el puerto " + puerto))
);
