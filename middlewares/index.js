const validarJWT = require("../middlewares/validar-jwt");
const validarCampos = require("../middlewares/validar_campos");
const validarRoles = require("../middlewares/validar_rol");

module.exports = {
  ...validarJWT,
  ...validarCampos,
  ...validarRoles,
};
