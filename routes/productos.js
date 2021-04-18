const { Router } = require("express");
const { check } = require("express-validator");
const router = Router();

const {
  listarProductos,
  agregarProducto,
  mostrarProducto,
  actualizarProducto,
  borrarProducto,
} = require("../controllers/productos");
const {
  existeCategoriaByNombre,
  existeProductoById,
} = require("../helpers/db-validators");
const {
  validarJWT,
  validarCampos,
  validarRol,
  esAdminRol,
} = require("../middlewares");

router.get("/", listarProductos);

router.get(
  "/:id",
  [
    check("id", "No es un ID valido").isMongoId(),
    check("id", "El ID no existe").custom(existeProductoById),
    validarCampos,
  ],
  mostrarProducto
);

router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre del Producto es obligatorio").not().isEmpty(),
    check("categoria").custom(existeCategoriaByNombre),
    validarCampos,
  ],
  agregarProducto
);

router.put(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID valido").isMongoId(),
    check("id", "El ID no existe").custom(existeProductoById),
    validarCampos,
  ],
  actualizarProducto
);

router.delete(
  "/:id",
  [
    validarJWT,
    esAdminRol,
    check("id", "No es un ID valido").isMongoId(),
    check("id", "El ID no existe").custom(existeProductoById),
    validarCampos,
  ],
  borrarProducto
);

module.exports = router;
