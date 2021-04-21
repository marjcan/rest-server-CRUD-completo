const path = require("path");
const { v4: uuidv4 } = require("uuid");

const subirArchivo = (
  files,
  extPermitidas = ["jpg", "jpeg", "gif", "png"],
  carpeta = ""
) => {
  return new Promise((resolve, reject) => {
    const { archivo } = files;

    const palabraCortada = archivo.name.split(".");

    const extension = palabraCortada[palabraCortada.length - 1];

    if (!extPermitidas.includes(extension)) {
      return reject(
        `la extension ${extension} no es permitida, debe ser: ${extPermitidas}`
      );
    }

    const nombreArchivo = uuidv4() + "." + extension;

    const uploadPath = path.join(
      __dirname,
      "../uploads/",
      carpeta,
      nombreArchivo
    );

    archivo.mv(uploadPath, (err) => {
      if (err) reject(err);

      resolve(nombreArchivo);
    });
  });
};

module.exports = {
  subirArchivo,
};
