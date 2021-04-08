const { Router } = require("express");
const { check } = require("express-validator");

const {
  usersGet,
  usersPost,
  usersPut,
  usersDelete,
} = require("../controllers/users");
const {
  existeRol,
  existeCorreo,
  existeUsuarioById,
} = require("../helpers/db-validators");
const { validarJWT } = require("../middlewares/validar-jwt");
const { validarCampos } = require("../middlewares/validar_campos");
const router = Router();

router.get("/", usersGet);
router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio...").not().isEmpty(),
    check("correo", "El correo no es valido...").isEmail(),
    check("correo").custom(existeCorreo),
    check("password", "El password debe ser de mas de 6 letras...").isLength({
      min: 6,
    }),
    check("rol").custom(existeRol),
    //check("rol", "El rol no es valido...").isIn(["ADMIN_ROLE", "USER_ROLE"]),
    validarCampos,
  ],
  usersPost
);
router.put(
  "/:id",
  [
    check("id", "No es un id valido...").isMongoId(),
    check("id").custom(existeUsuarioById),
    check("rol").custom(existeRol),
    validarCampos,
  ],
  usersPut
);
router.delete(
  "/:id",
  [
    validarJWT,
    check("id", "No es un id valido...").isMongoId(),
    check("id").custom(existeUsuarioById),
    validarCampos,
  ],
  usersDelete
);

module.exports = router;
