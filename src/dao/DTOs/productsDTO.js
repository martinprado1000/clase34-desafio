class ProductDTO {
    constructor(title,description,price,thumbnail,code,stock,category){
        this.title = title,
        this.description = description,
        this.price = price,
        this.thumbnail = thumbnail,
        this.code = code,
        this.stock = stock,
        this.category = category
    }
}

module.exports = ProductDTO;

  //   title: String,
  //   description: String,
  //   price: {
  //       type: Number,
  //       default: 0
  //   },
  //   thumbnail: String,
  //   code: {
  //       type: String,
  //       unique: true,
  //       index: true
  //   },
  //   stock: Number,
  //   category: {
  //       type: String,
  //       enum: ["fruta", "verdura"]
  //     },