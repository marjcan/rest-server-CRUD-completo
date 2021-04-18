const { request, response } = require("express");
const { Categoria } = require("../models");

//listar categaorias - paginado - populate
const listarCategorias = async (req, res = response) => {
  const { limite, desde } = req.query;

  /* const categorias = await Categoria.find({ estado: true })
    .populate("usuario", "nombre")
    .skip(Number(desde))
    .limit(Number(limite));

  const totalCategorias = await Categoria.countDocuments({ estado: true }); */

  const [totalCategorias, categorias] = await Promise.all([
    Categoria.countDocuments({ estado: true }),
    Categoria.find({ estado: true })
      .populate("usuario", "nombre")
      .skip(Number(desde))
      .limit(Number(limite)),
  ]);

  res.json({ totalCategorias, categorias });
};

//mostrar una categoria - populate

const mostrarCategoria = async (req, res = response) => {
  const { id } = req.params;

  const categoria = await Categoria.findById(id).populate("usuario", "nombre");
  /* if (!categoria || !categoria.estado) {
    return res.status(400).json({ msg: "No existe esa categoria" });
  } */

  res.status(200).json({ categoria });
};

const agregarCategoria = async (req, res = response) => {
  const nombre = req.body.nombre.toUpperCase();
  const categoriaDB = await Categoria.findOne({ nombre });
  if (categoriaDB) {
    return res.status(400).json({ msg: `La categoria ${nombre} ya esxiste` });
  }
  const data = {
    nombre,
    usuario: req.usuario._id,
  };
  const categoria = new Categoria(data);
  categoria.save();
  res.status(200).json({ categoria });
};

//Actualizar categoria - chequear que no exista
const actualizarCategoria = async (req, res = response) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;

  data.nombre = data.nombre.toUpperCase();
  data.usuario = req.usuario._id;

  const categoria = await Categoria.findByIdAndUpdate(id, data, {
    new: true,
  }).populate("usuario", "nombre");

  /* if (!categoria || !categoria.estado) {
    return res.status(400).json({ msg: "No existe esa categoria" });
  } */
  res.status(200).json({ categoria });
};

//Borrar categoria - estado:false
const borrarCategoria = async (req, res = response) => {
  const { id } = req.params;

  const categoria = await Categoria.findByIdAndUpdate(
    id,
    {
      estado: false,
    },
    { new: true }
  );

  /* if (!categoria || !categoria.estado) {
    return res.status(400).json({ msg: "No existe esa categoria" });
  } */
  res.status(200).json({ categoria });
};

module.exports = {
  agregarCategoria,
  listarCategorias,
  mostrarCategoria,
  actualizarCategoria,
  borrarCategoria,
};
