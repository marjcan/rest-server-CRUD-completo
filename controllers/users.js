const { request, response } = require("express");
const bcryptjs = require("bcryptjs");
const Usuario = require("../models/usuario");

const usersGet = async (req = request, res) => {
  //const { nombre, edad = 5, id } = req.query;
  const { limite = 2, desde = 0 } = req.query;
  /* const usuarios = await Usuario.find({ estado: true })
    .skip(Number(desde))
    .limit(Number(limite));
  const totalReg = await Usuario.countDocuments({ estado: true }); */

  const [totalReg, usuarios] = await Promise.all([
    Usuario.countDocuments({ estado: true }),
    Usuario.find({ estado: true }).skip(Number(desde)).limit(Number(limite)),
  ]);

  res.json({ totalReg, usuarios });
};
const usersPost = async (req, res = response) => {
  const { nombre, correo, password, rol } = req.body;
  const usuario = new Usuario({ nombre, correo, password, rol });

  //Encriptar password
  const salt = bcryptjs.genSaltSync();
  usuario.password = bcryptjs.hashSync(password, salt);

  //Grabar BaseDatos
  await usuario.save();

  res.json({
    usuario,
  });
};
const usersPut = async (req, res) => {
  const { id } = req.params;
  const { _id, password, google, correo, ...resto } = req.body;

  if (password) {
    //Encriptar password
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password, salt);
  }

  const usuario = await Usuario.findByIdAndUpdate(id, resto);

  res.json(usuario);
};
const usersDelete = async (req, res) => {
  const { id } = req.params;
  //BOrrar fisicamente de BD
  //const usuarioBorrado = await Usuario.findByIdAndDelete(id);
  const usuarioBorrado = await Usuario.findByIdAndUpdate(id, { estado: false });
  res.json({
    usuarioBorrado,
  });
};

module.exports = {
  usersGet,
  usersPost,
  usersPut,
  usersDelete,
};
