import {
  deleteAllProducts,
  insertManyProducts,
  findFirstTenProducts,
  findProductsByName,
  findProductById,
} from '../repositories/productRepository.js';
import Product from '../models/product.js';

const FAKE_STORE_API_URL = 'https://fakestoreapi.com/products';

export async function seedProductsService() {
  try {
    // Eliminar todos los productos
    await deleteAllProducts();
    
    // Eliminar índices existentes
    await Product.collection.dropIndexes();
    
    // Obtener productos de la API
    let apiResponse;
    try {
      apiResponse = await fetch(FAKE_STORE_API_URL);
    } catch {
      const err = new Error('Error al conectar con Fake Store API');
      err.statusCode = 502;
      throw err;
    }

    if (!apiResponse.ok) {
      const err = new Error('Error obteniendo datos de Fake Store API');
      err.statusCode = apiResponse.status || 502;
      throw err;
    }

    const products = await apiResponse.json();

    const productsToInsert = products.map((product) => ({
      title: product.title,
      price: product.price,
      description: product.description,
      category: product.category,
      image: product.image,
      rating: {
        rate: product.rating.rate,
        count: product.rating.count,
      },
      externalId: product.id,
    }));

    const inserted = await insertManyProducts(productsToInsert);
    return { insertedCount: inserted.length };
  } catch (error) {
    console.error('Error en seedProductsService:', error);
    throw error;
  }
}

export async function listFirstTenService() {
  const products = await findFirstTenProducts();
  return products;
}

export async function searchByNameService(name) {
  if (!name) {
    return await findFirstTenProducts();
  }
  const products = await findProductsByName(name);
  return products;
}

export async function getProductByIdService(id) {
  const product = await findProductById(id);
  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }
  return product;
}
