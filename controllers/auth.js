const { response } = require("express");
const bcryptjs = require("bcryptjs");

const Usuario = require("../models/usuario");
const generarJWT = require("../helpers/generar-jwt");

const login = async (req, res = response) => {
  const { correo, password } = req.body;

  try {
    //Verificar que esxiste el Usuario
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res
        .status(400)
        .json({ msg: "Correo - Password no son correctos - correo" });
    }

    //Verificar que el Usuario esta activo

    if (!usuario.estado) {
      return res
        .status(400)
        .json({ msg: "Correo - Password no son correctos - estado:false" });
    }
    //Verificar contraseña

    const verificarPassword = bcryptjs.compareSync(password, usuario.password);
    if (!verificarPassword) {
      return res
        .status(400)
        .json({ msg: "Correo - Password no son correctos - password" });
    }

    //Generar JWT

    const token = await generarJWT(usuario.id);

    res.json({ msg: "login OK", usuario, token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Comuniquese con el administrador" });
  }
};

module.exports = { login };
