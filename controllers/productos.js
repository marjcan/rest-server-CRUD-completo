const { response, request } = require("express");
const { existeProductoById } = require("../helpers/db-validators");

const { Producto, Categoria } = require("../models");

const listarProductos = async (req = request, res = response) => {
  const { limite = 20, desde = 0 } = req.query;

  /* const productos = await Producto.find({ estado: true })
    .limit(Number(limite))
    .skip(Number(desde))
    .populate("usuario", "nombre");

  const totalProductos = await Producto.countDocuments({ estado: true }); */

  const [totalProductos, productos] = await Promise.all([
    Producto.countDocuments({ estado: true }),
    Producto.find({ estado: true })
      .limit(Number(limite))
      .skip(Number(desde))
      .populate("usuario", "nombre"),
  ]);

  res.json({ totalProductos, productos });
};

const mostrarProducto = async (req = request, res = response) => {
  const { id } = req.params;
  const producto = await Producto.findById(id).populate("usuario", "nombre");

  res.json({ producto });
};

const agregarProducto = async (req, res = response) => {
  const { nombre, descripcion, categoria, precio } = req.body;

  const existeProducto = await Producto.findOne({ nombre: nombre });

  if (existeProducto) {
    return res.status(400).json({ msg: `El producto ${nombre} ya existe...` });
  }

  const existeCategoria = await Categoria.findOne({ nombre: categoria });
  if (!existeCategoria) {
    return res
      .status(400)
      .json({ msg: `La categoria ${categoria} no existe...` });
  }

  const data = {
    nombre,
    descripcion,
    precio,
    categoria: existeCategoria,
    usuario: req.usuario._id,
  };
  const nuevoProducto = new Producto(data);
  await nuevoProducto.save();

  res.status(200).json({ nuevoProducto });
};

const actualizarProducto = async (req = request, res = response) => {
  const { id } = req.params;
  const {
    nombre,
    categoria,
    descripcion,
    precio,
    disponible,
    ...data
  } = req.body;

  if (nombre) {
    existeNombre = await Producto.findOne({ nombre });

    if (existeNombre) {
      return res
        .status(400)
        .json({ msg: `El producto ${nombre} ya existe...` });
    }
    data.nombre = nombre;
  }
  if (categoria) {
    const existeCategoria = await Categoria.findOne({
      nombre: categoria.toUpperCase(),
    });
    if (!existeCategoria) {
      return res
        .status(400)
        .json({ msg: `La categoria ${categoria} no existe...` });
    } else {
      data.categoria = existeCategoria;
    }
  }
  if (descripcion) {
    data.descripcion = descripcion;
  }
  if (precio) {
    if (isNaN(precio)) {
      return res
        .status(400)
        .json({ msg: `El precio ${precio} no es valido...` });
    }
    data.precio = precio;
  }

  if (disponible) {
    data.disponible = disponible;
  }

  data.usuario = req.usuario._id;

  const productoActualizado = await Producto.findByIdAndUpdate(id, data, {
    new: true,
  });

  res.json({ productoActualizado });
};

const borrarProducto = async (req = request, res = response) => {
  const { id } = req.params;
  const productoBorrado = await Producto.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );
  res.status(200).json({ productoBorrado });
};

module.exports = {
  listarProductos,
  agregarProducto,
  mostrarProducto,
  actualizarProducto,
  borrarProducto,
};
