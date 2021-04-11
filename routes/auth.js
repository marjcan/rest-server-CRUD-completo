const { Router } = require("express");
const { check } = require("express-validator");
const { login, google } = require("../controllers/auth");
const { validarCampos } = require("../middlewares/validar_campos");

const router = Router();

router.post(
  "/login",
  [
    check("correo", "El correo no es valido...").isEmail(),
    check("password", "El password es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  login
);

router.post(
  "/google",
  [
    check("id_token", "El id_token es obligatorio...").not().isEmpty(),
    validarCampos,
  ],
  google
);

module.exports = router;
