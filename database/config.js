const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CNN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("BASE DE DATOS CONECTADA!");
  } catch (error) {
    console.log(error);
    throw new Error("ERRO CONECTANDO A LA BD");
  }
};

module.exports = {
  dbConnection,
};
