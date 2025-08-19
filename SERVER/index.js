import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import mongoose from "mongoose";
import { v2 as cloudinary } from 'cloudinary';
import bodyParser from "body-parser";


import imageRoute from "./src/Routes/ImageRoutes.js";

import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui.css";

const app = express();

dotenv.config();

app.use(bodyParser.json({ limit: "50mb" }));
app.use(morgan("dev"));
app.use(cors({
  origin: ["https://image-manager-black.vercel.app", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("DB connection established");
    })
    .catch(err => {
        console.log(err);
    });

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

// Swagger options
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Image Uploader API",
            version: "1.0.0",
            description: "API documentation for Image Uploader"
        },
        servers: [
            {
                url: "https://server-ashy-three.vercel.app/",
                description: "Image Uploader API"
            }
        ]
    },
    apis: ["./src/**/*.js"]
};

const specs = swaggerJsDoc(options);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs, { customCssUrl: CSS_URL }));

app.get("/", (req, res) => {
    res.send(`<a href="https://server-ashy-three.vercel.app/api-docs/">Swagger Documentation</a>`)
});

app.use("/api", imageRoute);

app.listen(process.env.PORT, () => {
    console.log(`Serving on port ${process.env.PORT}`);
});
