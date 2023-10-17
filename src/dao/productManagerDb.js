//const fs = require("fs");
const productModel = require("../models/productModel");

class ProductManagerDb {
  constructor(io) {
    this.io = io;
  }

  // -------- Con este metodo creo 100 productos -------------------------------------
  //   async createProducts() {
  //     try {
  //         const categoryes = ["fruta", "verdura"];
  //         for (let i = 1; i <= 100; i++) {
  //           const newProduct = new productModel({
  //             title: `P ${i}`,
  //             description: `Descripción del Producto ${i}`,
  //             price: Math.floor(Math.random() * 100) + 1,
  //             thumbnail: `Thumbnail del Producto ${i}`,
  //             code: `COD${i}`,
  //             stock: Math.floor(Math.random() * 10) + 1,
  //             category:
  //               categoryes[Math.floor(Math.random() * categoryes.length)],
  //           });

  //           await newProduct.save();
  //           console.log(`Producto ${i} creado`);
  //         }
  //     } catch (e) {
  //       console.log("Error al leer la db");
  //       return { status: 500, data: "Error al leer la db" };
  //     }
  //   }
  // ----------------------------------------------------------------------------------

  async getProducts() {
    try {
      let products = await productModel.find();
      //let products = await productModel.find().explain("executionStats"); // .explain("executionStats") Agregandole esto me retorna un detalle de la consulta, dentro de la propiedad executionStages esta lo que nos interesa. que es en relacion a cantidad de registro y tiempos de respuesta.
      //console.log(products)
      return products; // Como los objetos de mongo no son objetos json si no son bson,
      // hay que pasarle p.toObject() a los bson. Esto convierte un objeto a un objeto plano de JavaScript (un objeto literal)
    } catch (e) {
      console.log("Error al leer la db");
      return { status: 500, data: "Error al leer la db" };
    }
  }

  async getProductsPaginate(query, options) {
    try {
      return await productModel.paginate(query, options);
    } catch (e) {
      console.log("Error al leer la base de datos");
      return { status: 500, data: "Error al leer la base de datos" };
    }
  }

  async getProductById(id) {
    try {
      if (!id) {
        console.log("Debe enviar un ID valido");
        return { status: 400, data: "Debe enviar un ID valido" };
      }
      const productId = await productModel.findById(id);
      return { status: 200, data: productId };
      //return pId ;
    } catch (e) {
      console.log("Error al leer la base de datos");
      return { status: 500, data: "Error al leer la base de datos" };
    }
  }

  async getProductByCode(code) {
    try {
      if (!code) {
        console.log("Debe enviar un codigo valido");
        return { status: 400, data: "Debe enviar un codigo valido" };
      }
      const productCode = await productModel.find({ code: code });
      return { status: 200, data: productCode };
      //return pId ;
    } catch (e) {
      console.log("Error al leer la base de datos");
      return { status: 500, data: "Error al leer la base de datos" };
    }
  }

  async deleteProduct(id) {
    console.log(id);
    try {
      if (!id) {
        console.log("Debe enviar un ID");
        this.io.emit(
          "error",
          JSON.stringify({ error: 400, data: "Debe enviar un ID" })
        );
        return;
      }
      const prodDelete = await productModel.deleteOne({ _id: id });
      if (prodDelete.deletedCount != 1) {
        console.log(`El producto con id ${id} no existe`);
        this.io.emit(
          "error",
          JSON.stringify({
            error: 400,
            data: `El producto con id ${id} no existe`,
          })
        );
        return;
      }
      console.log(`El producto se elimino correctamente`);
      this.io.emit(
        "deleteProduct",
        JSON.stringify({
          error: 200,
          data: `El producto se elimino correctamente`,
        })
      );
      return;
    } catch (e) {
      console.log("Erro al eliminar el producto");
      this.io.emit(
        "error",
        JSON.stringify({ error: 400, data: `Error al eliminar el producto` })
      );
    }
  }

  async addProduct({
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
    category,
  }) {
    try {
      if (!title || !description || !price || !code || !stock || !category) {
        console.log("Campos incompletos");
        this.io.emit(
          "error",
          JSON.stringify({ error: 400, data: "Campos incompletos" })
        );
        return { status: 200, data: "Campos incompletos" };
      }
      const productCode = await this.getProductByCode(code);
      //console.log(productCode)
      if (productCode.data.length == 0) {
        const newProduct = {
          title,
          description,
          price,
          thumbnail: thumbnail || [],
          code,
          stock,
          category,
        };
        const newProductInserted = await productModel.create(newProduct);
        console.log(`Producto con codigo ${code} agregado correctamente`);
        this.io.emit("newProduct", JSON.stringify(newProductInserted));
        return { status: 200, data: newProductInserted };
      }
      this.io.emit(
        "error",
        JSON.stringify({
          error: 400,
          data: `El codigo de producto ${code} ya existe`,
        })
      );
      return { status: 200, data: `El codigo de producto ${code} ya existe` };
    } catch (e) {
      console.log("Erro desconocido al agregar el producto");
      return {
        status: 500,
        data: "Erro desconocido al agregar el producto",
      };
    }
  }

  async updateProduct(
    id,
    { title, description, price, thumbnail, code, stock, category }
  ) {
    try {
      console.log(id);
      if (
        !title ||
        !description ||
        !price ||
        !thumbnail ||
        !code ||
        !stock ||
        !category
      ) {
        console.log("Campos incompletos");
        this.io.emit(
          "error",
          JSON.stringify({ error: 400, data: "Campos incompletos" })
        );
        return;
      }
      const productCode = await this.getProductByCode(code);
      if (productCode.data.length != 0) {
        // Existe entonces lo edito
        console.log("existe entonces lo edito");
        const editProduct = {
          title: title || productId.title,
          description: description || productId.description,
          price: price || productId.price,
          thumbnail: thumbnail || productId.thumbnail,
          code: code || productId.code,
          stock: stock || productId.stock,
          category: category || productId.category,
        };
        await productModel.updateOne({ _id: id }, editProduct);
        console.log(`El producto con codigo: ${code} se edito correctamente`);
        this.io.emit(
          "editProduct",
          JSON.stringify({
            error: 200,
            data: `El producto con codigo: ${code} se edito correctamente`,
          })
        );
        return;
      }
      console.log("El codigo de producto NO existe o esta duplicado");
      this.io.emit(
        "error",
        JSON.stringify({
          error: 400,
          data: `El codigo de producto ${code} no existe o esta duplicado`,
        })
      );
      return;
    } catch (e) {
      this.io.emit(
        "error",
        JSON.stringify({
          error: 500,
          data: `Erro desconocido al editar el producto`,
        })
      );
      return { status: 500, data: "Erro desconocido al editar el producto" };
    }
  }
}

module.exports = { ProductManagerDb };
