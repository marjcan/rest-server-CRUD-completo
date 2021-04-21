const path = require("path");
const fs = require("fs");

const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { response } = require("express");
const { subirArchivo } = require("../helpers/subir-archivo");

const { Usuario, Producto } = require("../models");

const cargarArchivo = async (req, res = response) => {
  /* if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    return res.status(400).json({ msg: "No hay archivos a subir" });
  } */
  try {
    const nombreArchivo = await subirArchivo(req.files, undefined, "imagenes");
    res.json({ msg: nombreArchivo });
  } catch (error) {
    res.status(400).json({ error });
  }
};

const actualizarImagen = async (req, res = response) => {
  /*  if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    return res.status(400).json({ msg: "No hay archivos a subir" });
  }
 */
  try {
    const { coleccion, id } = req.params;

    let modelo;

    switch (coleccion) {
      case "usuarios":
        modelo = await Usuario.findById(id);
        if (!modelo) {
          return res
            .status(400)
            .json({ msg: `No existe un usuario con el id: ${id}` });
        }

        break;
      case "productos":
        modelo = await Producto.findById(id);
        if (!modelo) {
          return res
            .status(400)
            .json({ msg: `No existe un producto con el id: ${id}` });
        }

        break;
      default:
        res.status(500).json({ msg: "no se programo esa opcion..." });
        break;
    }
    //limpiar imagenes previas en el servidor
    if (modelo.img) {
      const pathImg = path.join(
        __dirname,
        "../uploads/",
        coleccion,
        modelo.img
      );
      if (fs.existsSync(pathImg)) {
        await fs.unlinkSync(pathImg);
      }
    }

    const nombreArchivo = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombreArchivo;
    await modelo.save();

    res.json({ modelo });
  } catch (error) {
    res.status(400).json({ error });
  }
};

const mostrarImagen = async (req, res = response) => {
  try {
    const { coleccion, id } = req.params;

    let modelo;

    switch (coleccion) {
      case "usuarios":
        modelo = await Usuario.findById(id);
        if (!modelo) {
          return res
            .status(400)
            .json({ msg: `No existe un usuario con el id: ${id}` });
        }

        break;
      case "productos":
        modelo = await Producto.findById(id);
        if (!modelo) {
          return res
            .status(400)
            .json({ msg: `No existe un producto con el id: ${id}` });
        }

        break;
      default:
        res.status(500).json({ msg: "no se programo esa opcion..." });
        break;
    }
    //limpiar imagenes previas en el servidor
    if (modelo.img) {
      const pathImg = path.join(
        __dirname,
        "../uploads/",
        coleccion,
        modelo.img
      );
      if (fs.existsSync(pathImg)) {
        return res.sendFile(pathImg);
      }
    }
  } catch (error) {
    res.status(400).json({ error });
  }
  const pathNoImg = path.join(__dirname, "../assets/", "no-image.jpg");

  res.sendFile(pathNoImg);
};

const actualizarImagenCloudinary = async (req, res = response) => {
  /*  if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    return res.status(400).json({ msg: "No hay archivos a subir" });
  }
 */
  try {
    const { coleccion, id } = req.params;

    let modelo;

    switch (coleccion) {
      case "usuarios":
        modelo = await Usuario.findById(id);
        if (!modelo) {
          return res
            .status(400)
            .json({ msg: `No existe un usuario con el id: ${id}` });
        }

        break;
      case "productos":
        modelo = await Producto.findById(id);
        if (!modelo) {
          return res
            .status(400)
            .json({ msg: `No existe un producto con el id: ${id}` });
        }

        break;
      default:
        res.status(500).json({ msg: "no se programo esa opcion..." });
        break;
    }
    //limpiar imagenes previas en el servidor
    if (modelo.img) {
      const nombreArr = modelo.img.split("/");
      const nombre = nombreArr[nombreArr.length - 1];
      const [public_id] = nombre.split(".");
      cloudinary.uploader.destroy(public_id);
    }

    const { tempFilePath } = req.files.archivo;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

    modelo.img = secure_url;
    await modelo.save();

    res.json(modelo);
  } catch (error) {
    res.status(400).json({ error });
  }
};

module.exports = {
  cargarArchivo,
  actualizarImagen,
  mostrarImagen,
  actualizarImagenCloudinary,
};
