const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../database/config");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.routesPaths = {
      users: "/api/users",
      auth: "/api/auth",
      buscar: "/api/buscar",
      categorias: "/api/categorias",
      productos: "/api/productos",
    };

    //Database Connection
    this.conectarDb();

    //Middlewares
    this.middlewares();

    //Routes
    this.routes();
  }

  async conectarDb() {
    await dbConnection();
  }

  middlewares() {
    this.app.use(cors());

    this.app.use(express.static("public"));

    //Body parser
    this.app.use(express.json());
  }

  routes() {
    this.app.use(this.routesPaths.auth, require("../routes/auth"));
    this.app.use(this.routesPaths.users, require("../routes/users"));
    this.app.use(this.routesPaths.buscar, require("../routes/buscar"));
    this.app.use(this.routesPaths.categorias, require("../routes/categorias"));
    this.app.use(this.routesPaths.productos, require("../routes/productos"));
  }
  listen() {
    this.app.listen(this.port, () => {
      console.log("Server on port: ", this.port);
    });
  }
}

module.exports = Server;
