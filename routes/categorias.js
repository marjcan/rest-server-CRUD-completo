const { Router, response } = require("express");
const { check } = require("express-validator");

const {
  validarJWT,
  validarCampos,
  validarRol,
  esAdminRol,
} = require("../middlewares");
const {
  agregarCategoria,
  listarCategorias,
  mostrarCategoria,
  actualizarCategoria,
  borrarCategoria,
} = require("../controllers/categoria");
const { existeCategoriaById } = require("../helpers/db-validators");

const router = Router();

//Publico
router.get("/", listarCategorias);

//Publico
//validar id - que exista y que sea de mongo
router.get(
  "/:id",
  [
    check("id", "No es un id valido...").isMongoId(),
    check("id").custom(existeCategoriaById),
    validarCampos,
  ],
  mostrarCategoria
);

//Publico con token
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio...").not().isEmpty(),
    validarCampos,
  ],
  agregarCategoria
);

//Publico con token
router.put(
  "/:id",
  [
    validarJWT,
    check("id", "No es un id valido...").isMongoId(),
    check("id").custom(existeCategoriaById),
    check("nombre", "El nombre es obligatorio...").not().isEmpty(),
    validarCampos,
  ],
  actualizarCategoria
);

//con token - solo ADMIN_ROL
router.delete(
  "/:id",
  [
    validarJWT,
    esAdminRol,
    check("id", "No es un id valido...").isMongoId(),
    check("id").custom(existeCategoriaById),
    validarCampos,
  ],
  borrarCategoria
);

module.exports = router;
