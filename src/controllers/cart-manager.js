const fs = require("fs").promises;

class CartManager {
    constructor(path) {
        this.carts = [];
        this.path = path;
        this.ultId = 0;

        this.cargarCarritos();

    }

    async cargarCarritos() {
        try {
            const data = await fs.readFile(this.path, "utf-8");
            this.carts = JSON.parse(data);
            if (this.carts.length > 0) {
                this.ultId = Math.max(...this.carts.map(cart => cart.id));
            }
        } catch (error) {
            console.log("Error al crear los carritos: ", error);
            await this.guardarCarritos();
        }
    }

    async guardarCarritos() {
        await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
    }

    async crearCarrito() {
        try {
            const nuevoCarrito = new CartModel({products: []});
            await nuevoCarrito.save();
            return nuevoCarrito;
            
        } catch (error) {
            console.log("Error al crear un carrito nuevo", error)
            throw error;
            
        }}

    async getCarritoById(carritoId) {
        try {
            const carrito = await CartModel.findById(carritoId);

            if (!carrito) {
                console.log("No hay carrito con ese id");
                return;
            }

            return carrito;
        } catch (error) {
            console.log("Error al obtener un carrito por id: ", error);
        }
    }

    async agregarProductoAlCarrito(carritoId, productoId, quantity = 1) {
        try{
            const carrito = await this.getCarritoById(carritoId);
            const existeProducto = carrito.products.find(item = item.product.toString () === productId);
            
            if(existeProducto){
                existeProducto.quantity += quantity;
            }else {
                carrito.products.push({product: productId, quantity});
            }

            carrito.markModified("products");
            
            await carrito.save();
            return carrito;
        } catch (error){
            console.log("Error al agregar un producto", error)
            throw error
        }}}


module.exports = CartManager;