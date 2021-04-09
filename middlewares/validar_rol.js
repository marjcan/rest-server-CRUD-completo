const { request, response } = require("express");

const esAdminRol = (req = request, res = response, next) => {
  const usuario = req.usuario;
  if (!usuario) {
    return res.status(500).json({
      msg: "se esta intentando validar antes de registrar usuario...",
    });
  }

  if (usuario.rol !== "ADMIN_ROL") {
    return res
      .status(500)
      .json({ msg: `El usuario ${usuario.nombre} no es Administrador...` });
  }

  next();
};

const validarRol = (...roles) => {
  return (req = request, res = response, next) => {
    const usuario = req.usuario;
    if (!usuario) {
      return res.status(500).json({
        msg: "se esta intentando validar antes de registrar usuario...",
      });
    }

    if (!roles.includes(usuario.rol)) {
      return res.status(500).json({
        msg: `El usuario ${usuario.nombre} no esta autorizado a realizar la tarea... Debe ser ${roles}`,
      });
    }

    next();
  };
};

module.exports = { esAdminRol, validarRol };
