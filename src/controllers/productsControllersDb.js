//const { ProductManager } = require("../dao/productManager");
//const { ProductManagerDb } = require("../dao/productManagerDb");
const { ProductsService } = require("../services/productsServices")

const pagesFn = (io) => {
  //instacio el manager
  //const manager = new ProductManager("db/products.json", io);
  //const manager = new ProductManagerDb(io);
  const productsService = new ProductsService(io);

  //********get Products*****************************************
  // const products = async (req, res) => {
  //   try {
  //     // const limitInt = parseInt(req.query.limit);
  //     const data = await manager.getProducts();
  //     res.status(200).json(data);
  //   } catch (e) {
  //     console.log(e);
  //     return { Error: "Algo salio mal con la consulta" };
  //   }
  // };

  //**********get Products con paguinate**************************
  const products = async (req, res) => {   // ?limit=2&page=2&query=fruta&sort=asc  // esto podemos recibir en la consulta
    try {
      console.log(req.query)
      const query = req.query // Obtengo todas las query y se las paso al manager
      console.log(query)
      // const limitInt = parseInt(req.query.limit);
      const response = await productsService.getProductsPaginate(query);
      //console.log(response.data) // Como la consulta la ejecute con paginate me retorna lod documentos mas la info de paguinacion
      res.status(200).json(response.data); // Solo retorno los documentos, NO la info de paguinacion.
    } catch (e) {
      console.log(e);
      return { Error: "Algo salio mal con la consulta" };
    }
  };

  //**********get ProductById************************************
  const productId = async (req, res) => {
    try {
      const pid = req.params.pid;
      const response = await productsService.getProductById(pid);
      const product = response.data
      res.status(200).json(product);
    } catch (e) {
      console.log(e);
      return { Error: "Algo salio mal con la consulta" };
    }
  };
  

  //post Product
  const productAdd = async (req, res) => {
    try {
      const product = req.body;
      // const response = await manager.addProduct(product);
      // console.log(response.data)
      //res.status(200).json(response.data)
      const response = await productsService.addProduct(product);
      res.status(200).json(response.data);
    } catch (e) {
      console.log(e);
      return { Error: "Algo salio mal con la consulta" };
    }
  };

  //put Product
  const productPut = async (req, res) => {
    try {
      const pid = req.params.pid;
      const product = req.body;
      const data = await productsService.updateProduct(pid, product);
      res.status(data.status).send(data.respuesta);
    } catch (e) {
      console.log(e);
      return { Error: "Algo salio mal con la consulta" };
    }
  };

  //delete Product
  const productDelete = async (req, res) => {
    try {
      const product = req.params.pid;
      const data = await productsService.deleteProduct(product);
      res.status(data.status).send(data.respuesta);
    } catch (e) {
      console.log(e);
      return { Error: "Algo salio mal con la consulta" };
    }
  };

  return {
    products,
    productId,
    productAdd,
    productDelete,
    productPut
  };
};

module.exports = pagesFn;
