const express = require("express");
const path = require("path");
const morgan = require("morgan");
const cors = require("cors");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
//const docs = require('./docs');

const app = express();
const PORT = process.env.PORT || 4000;

//Swagger docs
const swagger_route = "/api";
const swaggerOptions = {
  explorer: true,
  apis: [
    "./routes/*.js",    
  ],
  swaggerDefinition: {    
    openapi: "3.0.1",
    info: {
      version: "1.0.0",
      description: "EcoSystem API",
      title: "EcoSystem API",
      servers: ["http://localhost:4000"],
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
console.log("SwaggerOptions is: ", swaggerDocs);
console.log("Swagger Route is:", swagger_route);

// app configs.
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(morgan("dev"));
app.use(cors({ origin: "*", 
methods: "*",
allowedHeaders: "*"
}));
app.use(express.urlencoded({ extended: false }));

app.use("/", express.static(path.join(__dirname, "./public")));
app.use("/api/v1/healthcheck", require("./routes/healthcheck"));
app.use('/api/v1/collections',require('./routes/collections'));
app.use('/api/v1/collection',require('./routes/collection'));
//app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(docs));
app.use(swagger_route, swaggerUI.serve, swaggerUI.setup(swaggerDocs));
app.get("/api-docs/swagger.json", (req, res) => res.json(swaggerDocs));

//initialize the app.
async function initialize(){    
    app.listen(PORT);
};

initialize()
    .finally(
        () => console.log(`app started on port:${PORT}`)
    );