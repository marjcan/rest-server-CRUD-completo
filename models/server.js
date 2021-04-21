const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../database/config");
const fileUpload = require("express-fileupload");

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
      uploads: "/api/uploads",
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

    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
      })
    );
  }

  routes() {
    this.app.use(this.routesPaths.auth, require("../routes/auth"));
    this.app.use(this.routesPaths.users, require("../routes/users"));
    this.app.use(this.routesPaths.buscar, require("../routes/buscar"));
    this.app.use(this.routesPaths.categorias, require("../routes/categorias"));
    this.app.use(this.routesPaths.productos, require("../routes/productos"));
    this.app.use(this.routesPaths.uploads, require("../routes/uploads"));
  }
  listen() {
    this.app.listen(this.port, () => {
      console.log("Server on port: ", this.port);
    });
  }
}

module.exports = Server;
