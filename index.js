const express = require('express');
const fs = require('fs').promises;
const { nuevoRoommate, recalcularDeudas } = require('./roommates');
const { nuevoGasto, deleteGasto, editGasto } = require('./gastos');
// const { send } = require('./correo'); // Asegúrate de tener el archivo y la función de correo habilitados

const app = express();
const PORT = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Ruta principal para servir la página HTML
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Ruta para agregar un nuevo roommate
app.post('/roommate', async (req, res) => {
  try {
    await nuevoRoommate();
    await recalcularDeudas(); // Espera a que se recalculen las deudas
    res.status(201).send('Roommate agregado y deudas recalculadas');
  } catch (e) {
    res.status(500).send(`Error al agregar roommate: ${e.message}`);
  }
});

// Ruta para obtener la lista de roommates
app.get('/roommates', async (req, res) => {
  try {
    const roommatesJSON = await fs.readFile('data/roommates.json', 'utf8');
    const roommates = JSON.parse(roommatesJSON);
    res.json(roommates);
  } catch (e) {
    res.status(500).send(`Error al obtener roommates: ${e.message}`);
  }
});

// Ruta para obtener la lista de gastos
app.get('/gastos', async (req, res) => {
  try {
    const gastosJSON = await fs.readFile('data/gastos.json', 'utf8');
    const gastos = JSON.parse(gastosJSON);
    res.json(gastos);
  } catch (e) {
    res.status(500).send(`Error al obtener gastos: ${e.message}`);
  }
});

// Ruta para agregar un nuevo gasto
app.post('/gasto', async (req, res) => {
  try {
    const gasto = req.body;
    // await send(gasto); // Asegúrate de que el módulo de correo esté habilitado si es necesario
    await nuevoGasto(gasto);
    await recalcularDeudas(); // Espera a que se recalculen las deudas
    res.status(201).send('Gasto agregado y deudas recalculadas');
  } catch (e) {
    res.status(500).send(`Error al agregar gasto: ${e.message}`);
  }
});

// Ruta para editar un gasto existente
app.put('/gasto', async (req, res) => {
  try {
    const gasto = req.body;
    const { id } = req.query;
    await editGasto(gasto, id);
    await recalcularDeudas(); // Espera a que se recalculen las deudas
    res.send('Gasto editado con éxito');
  } catch (e) {
    res.status(500).send(`Error al editar gasto: ${e.message}`);
  }
});

// Ruta para eliminar un gasto
app.delete('/gasto', async (req, res) => {
  try {
    const { id } = req.query;
    await deleteGasto(id);
    await recalcularDeudas(); // Espera a que se recalculen las deudas
    res.send('Gasto eliminado');
  } catch (e) {
    res.status(500).send(`Error al eliminar gasto: ${e.message}`);
  }
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});

