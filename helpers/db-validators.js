const { Categoria, Producto } = require("../models");
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

const existeCategoriaById = async (id) => {
  const existeCategoria = await Categoria.findById(id);
  if (!existeCategoria) {
    throw new Error(`No existe categoria con ese Id...`);
  }
};

const existeCategoriaByNombre = async (categoria) => {
  const existeCategoria = await Categoria.findOne({
    nombre: categoria,
    estado: true,
  });
  if (!existeCategoria) {
    throw new Error(`No existe categoria con ese nombre...`);
  }
};

const existeProductoById = async (id) => {
  const existeProducto = await Producto.findById(id);
  if (!existeProducto) {
    throw new Error(`No existe producto con ese Id...`);
  }
};

module.exports = {
  existeRol,
  existeCorreo,
  existeUsuarioById,
  existeCategoriaById,
  existeCategoriaByNombre,
  existeProductoById,
};
