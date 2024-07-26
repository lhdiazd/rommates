const fs = require("fs").promises;
const { v4: uuidv4 } = require("uuid");

// Agrega un nuevo gasto al archivo JSON
const nuevoGasto = async (gasto) => {
  gasto.fecha = new Date();
  gasto.id = uuidv4().slice(30);
  
  // Lee el archivo de gastos
  const gastosJSON = await fs.readFile("data/gastos.json", "utf8");
  let { gastos } = JSON.parse(gastosJSON);
  
  // Agrega el nuevo gasto
  gastos.push(gasto);
  
  // Guarda los cambios en el archivo
  await fs.writeFile("data/gastos.json", JSON.stringify({ gastos }));
};

// Elimina un gasto del archivo JSON por ID
const deleteGasto = async (id) => {
  // Lee el archivo de gastos
  const gastosJSON = await fs.readFile("data/gastos.json", "utf8");
  let { gastos } = JSON.parse(gastosJSON);
  
  // Filtra el gasto por ID
  gastos = gastos.filter(g => g.id !== id);
  
  // Guarda los cambios en el archivo
  await fs.writeFile("data/gastos.json", JSON.stringify({ gastos }));
};

// Edita un gasto existente en el archivo JSON por ID
const editGasto = async (gasto, id) => {
  // Lee el archivo de gastos
  const gastosJSON = await fs.readFile("data/gastos.json", "utf8");
  let { gastos } = JSON.parse(gastosJSON);
  
  // Mapea los gastos para encontrar el ID y actualizarlo
  gastos = gastos.map(g => g.id === id ? { ...gasto, id } : g);
  
  // Guarda los cambios en el archivo
  await fs.writeFile("data/gastos.json", JSON.stringify({ gastos }));
};

module.exports = {
  nuevoGasto,
  deleteGasto,
  editGasto,
};
