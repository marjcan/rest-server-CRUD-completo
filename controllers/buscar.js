const { request, response } = require("express");

const { ObjectId } = require("mongoose").Types;
const { Usuario, Categoria, Producto } = require("../models");

const coleccionesPermitidas = [
  "usuarios",
  "categorias",
  "productos",
  "productosxcategorias",
];

const buscarUsuario = async (termino = "", res = response) => {
  const isMongoId = ObjectId.isValid(termino);
  if (isMongoId) {
    const usuario = await Usuario.findById(termino);
    res.json({ resultados: usuario ? [usuario] : [] });
  }
  //expresion regular "i" de insensible
  const regex = new RegExp(termino, "i");
  const usuarios = await Usuario.find({
    $or: [{ nombre: regex }, { correo: regex }],
    $and: [{ estado: true }],
  });

  res.json({ resultados: usuarios });
};

const buscarCategoria = async (termino = "", res = response) => {
  const isMongoId = ObjectId.isValid(termino);
  if (isMongoId) {
    const categoria = await Categoria.findById(termino).populate(
      "usuario",
      "nombre"
    );
    res.json({ resultados: categoria ? [categoria] : [] });
  }
  //expresion regular "i" de insensible
  const regex = new RegExp(termino, "i");
  const categorias = await Categoria.find({
    nombre: regex,
    estado: true,
  }).populate("usuario", "nombre");

  res.json({ resultados: categorias });
};

const buscarProducto = async (termino = "", res = response) => {
  const isMongoId = ObjectId.isValid(termino);
  if (isMongoId) {
    const producto = await Producto.findById(termino).populate(
      "categoria",
      "nombre"
    );
    res.json({ resultados: producto ? [producto] : [] });
  }
  //expresion regular "i" de insensible
  const regex = new RegExp(termino, "i");
  const productos = await Producto.find({
    nombre: regex,
    estado: true,
  }).populate("categoria", "nombre");

  res.json({ resultados: productos });
};

const buscarProductosPorCategoria = async (termino = "", res = response) => {
  const isMongoId = ObjectId.isValid(termino);
  let categoriabuscada = "";
  isMongoId
    ? (categoriabuscada = await Categoria.findById(termino, {
        estado: true,
      }))
    : (categoriabuscada = await Categoria.findOne({
        nombre: termino,
        estado: true,
      }));

  if (!categoriabuscada) {
    return res.json({ msg: `no existe categoria ${termino}` });
  }

  const productos = await Producto.find({
    categoria: categoriabuscada,
    estado: true,
  });
  res.json({ resultados: productos ? [productos] : [] });
};

const buscar = (req, res = response) => {
  const { coleccion, termino } = req.params;

  if (!coleccionesPermitidas.includes(coleccion)) {
    return res.json({
      msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`,
    });
  }

  switch (coleccion) {
    case "usuarios":
      buscarUsuario(termino, res);
      break;
    case "categorias":
      buscarCategoria(termino, res);
      break;
    case "productos":
      buscarProducto(termino, res);
      break;
    case "productosxcategorias":
      buscarProductosPorCategoria(termino, res);
      break;
    default:
      break;
  }
};

module.exports = { buscar };
