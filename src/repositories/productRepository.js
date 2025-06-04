import Product from '../models/product.js';

export async function deleteAllProducts() {
  return await Product.deleteMany({});
}

export async function insertManyProducts(productsArray) {
  return await Product.insertMany(productsArray);
}
