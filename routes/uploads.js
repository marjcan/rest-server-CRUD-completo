const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares");

const {
  cargarArchivo,
  actualizarImagen,
  mostrarImagen,
  actualizarImagenCloudinary,
} = require("../controllers/uploads");
const { validarColeccion } = require("../helpers/db-validators");
const { validarArchivoSubir } = require("../middlewares/validar-archivo-subir");

const router = Router();

router.post("/", validarArchivoSubir, cargarArchivo);

router.put(
  "/:coleccion/:id",
  [
    validarArchivoSubir,
    check("id", "No es un ID valido").isMongoId(),
    check("coleccion").custom((c) =>
      validarColeccion(c, ["usuarios", "productos"])
    ),
    validarCampos,
  ],
  //actualizarImagen
  actualizarImagenCloudinary
);

router.get(
  "/:coleccion/:id",
  [
    check("id", "No es un ID valido").isMongoId(),
    check("coleccion").custom((c) =>
      validarColeccion(c, ["usuarios", "productos"])
    ),
    validarCampos,
  ],
  mostrarImagen
);

module.exports = router;
