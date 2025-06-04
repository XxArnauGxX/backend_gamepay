import Product from '../models/product.js';

export async function deleteAllProducts() {
  return await Product.deleteMany({});
}

export async function insertManyProducts(productsArray) {
  return await Product.insertMany(productsArray);
}

export async function findFirstTenProducts() {
  return await Product.find({}).sort({ title: 1 }).limit(10);
}

export async function findProductsByName(name) {
  const regex = new RegExp(name, 'i');
  return await Product.find({ title: regex }).sort({ title: 1 }).limit(10);
}

export async function findProductById(id) {
  return await Product.findById(id);
}
