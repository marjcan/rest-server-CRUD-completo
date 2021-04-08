const Rol = require("../models/rol");
const Usuario = require("../models/usuario");

const existeRol = async (rol = "") => {
  const existeRol = await Rol.findOne({ rol });
  if (!existeRol) {
    throw new Error(`El rol ${rol} no existe en la BD...`);
  }
};

const existeCorreo = async (correo) => {
  const existeCorreo = await Usuario.findOne({ correo });
  if (existeCorreo) {
    throw new Error(`El correo ${correo} ya existe...`);
  }
};

const existeUsuarioById = async (id) => {
  const existeUsuario = await Usuario.findById(id);
  if (!existeUsuario) {
    throw new Error(`No existe usuario con ese Id...`);
  }
};

module.exports = {
  existeRol,
  existeCorreo,
  existeUsuarioById,
};
