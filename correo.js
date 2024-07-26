const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

// Configuración del transporte de correo
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "nodemailerADL@gmail.com",
    pass: "fullstackjavascript",
  },
});

// Función para enviar el correo electrónico
const send = async ({ monto, descripcion, roommate }) => {
  try {
    // Leer la lista de correos de roommates desde el archivo JSON
    const filePath = path.join(__dirname, "data", "roommates.json");
    const data = fs.readFileSync(filePath, "utf8");
    const { roommates } = JSON.parse(data);

    // Obtener correos electrónicos de los roommates
    const correos = roommates.map(r => r.email);

    // Configuración del correo
    const mailOptions = {
      from: "nodemailerADL@gmail.com",
      to: ["nodemaileradl@gmail.com", ...correos],
      subject: "¡Nuevo gasto entre roomies registrado!",
      html: `<h6>${roommate} ha registrado un gasto de $${monto} por el siguiente motivo: ${descripcion}</h6>`,
    };

    // Enviar el correo
    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    throw error;
  }
};

module.exports = { send };