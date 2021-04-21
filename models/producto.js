const { Schema, model } = require("mongoose");

const ProductosSchema = Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  estado: {
    type: Boolean,
    required: true,
    default: true,
  },
  precio: {
    type: Number,
    default: 0,
  },
  descripcion: {
    type: String,
  },
  disponible: {
    type: Boolean,
    default: true,
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  categoria: {
    type: Schema.Types.ObjectId,
    ref: "Categoria",
    required: true,
  },
  img: {
    type: String,
  },
});

ProductosSchema.methods.toJSON = function () {
  const { __v, estado, ...producto } = this.toObject();

  return producto;
};

module.exports = model("Producto", ProductosSchema);
