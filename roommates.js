const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs").promises;

// Agrega un nuevo roommate con información aleatoria
const nuevoRoommate = async () => {
  try {
    // Obtiene un usuario aleatorio
    const { data } = await axios.get("https://randomuser.me/api");
    const usuario = data.results[0];
    const roommate = {
      id: uuidv4().slice(30),
      nombre: `${usuario.name.first} ${usuario.name.last}`,
      email: usuario.email,
      debe: 0,
      recibe: 0,
    };

    // Lee el archivo de roommates
    const roommatesJSON = await fs.readFile("data/roommates.json", "utf8");
    const { roommates } = JSON.parse(roommatesJSON);
    
    // Agrega el nuevo roommate
    roommates.push(roommate);
    
    // Guarda los cambios en el archivo
    await fs.writeFile("data/roommates.json", JSON.stringify({ roommates }));
  } catch (error) {
    console.error("Error al agregar nuevo roommate:", error);
  }
};

// Recalcula las deudas y créditos de los roommates
const recalcularDeudas = async () => {
  try {
    // Lee los archivos de roommates y gastos
    const roommatesJSON = await fs.readFile("data/roommates.json", "utf8");
    const gastosJSON = await fs.readFile("data/gastos.json", "utf8");

    const { roommates } = JSON.parse(roommatesJSON);
    const { gastos } = JSON.parse(gastosJSON);

    // Inicializa las deudas y créditos
    const cantidadDeRoommates = roommates.length;
    let updatedRoommates = roommates.map(r => ({
      ...r,
      debe: 0,
      recibe: 0,
      total: 0
    }));

    // Calcula las deudas y créditos
    gastos.forEach(({ monto, roommate }) => {
      const montoPorPersona = monto / cantidadDeRoommates;
      updatedRoommates = updatedRoommates.map(r => {
        if (r.nombre === roommate) {
          r.recibe += montoPorPersona * (cantidadDeRoommates - 1);
        } else {
          r.debe -= montoPorPersona;
        }
        r.total = r.recibe - r.debe;
        return r;
      });
    });

    // Guarda los cambios en el archivo
    await fs.writeFile("data/roommates.json", JSON.stringify({ roommates: updatedRoommates }));
  } catch (error) {
    console.error("Error al recalcular deudas:", error);
  }
};

module.exports = {
  nuevoRoommate,
  recalcularDeudas,
};
