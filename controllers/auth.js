const { response } = require("express");
const bcryptjs = require("bcryptjs");

const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

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

const google = async (req, res = response) => {
  const { id_token } = req.body;
  try {
    const { nombre, img, correo } = await googleVerify(id_token);

    let usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      const data = {
        nombre,
        correo,
        password: "123",
        img,
        google: true,
      };
      usuario = new Usuario(data);

      await usuario.save();
    }

    if (!usuario.estado) {
      res.status(401).json({ msg: "Hable con el administrador..." });
    }

    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    res.status(400).json({ msg: "Token de Google no es valido..." });
  }
};

module.exports = { login, google };
