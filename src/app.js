const express = require("express");
const exphbs = require("express-handlebars")
const app = express(); 
const PUERTO = 8080;
const socket = require("socket.io");
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const usuariosRouter = require("./routes/usuarios.router.js");


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("./src/public"));

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");


//Rutas 
app.use("/api", productsRouter);
app.use("/api", cartsRouter);
app.use("/", viewsRouter);
app.use("/", usuariosRouter);


const httpServer = app.listen(PUERTO, () => {
    console.log(`Escuchando en el puerto: ${PUERTO}`);
})

// CHAT
const MessageModel = require ("./models/message.model.js");
const io = new socket.Server(httpServer);

io.on("connection", (socket) => {
    console.log ("Nuevo usuario conectado");

    socket.on("message", async data =>{

        await MessageModel.create(data);

        const messages = await MessageModel.find();
        console.log(messages);
        io.sockets.emit("message", messages);
    })
})


const ProductManager = require("./controllers/product-manager.js");
const productManager = new ProductManager("./src/models/productos.json");

const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://Bresser:coderhouse01@cluster0.uc7izih.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("Conectado a la Base de Datos"))
    .catch((error) => console.log("Error encontrado", error))


io.on("connection", async (socket) => {
    console.log("Un cliente conectado");

    socket.emit("productos", await productManager.getProducts());

    socket.on("eliminarProducto", async (id) => {
        await productManager.deleteProduct(id);
        socket.emit("productos", await productManager.getProducts());
    })


    socket.on("agregarProducto", async (producto) => {
        await productManager.addProduct(producto);
        io.socket.emit("productos", await productManager.getProducts());
    })
})

