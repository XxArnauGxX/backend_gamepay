import {
  seedProductsService,
  listFirstTenService,
  searchByNameService,
  getProductByIdService,
} from '../services/productService.js';

export async function seedProducts(req, res) {
  try {
    const { insertedCount } = await seedProductsService();
    return res.status(200).json({
      message: `Products seeded successfully: ${insertedCount} inserted`,
      insertedCount,
    });
  } catch (e) {
    console.error(e);
    const status = e.statusCode || 500;
    return res.status(status).json({ error: e.message });
  }
}

export async function listFirstTen(req, res) {
  try {
    const products = await listFirstTenService();
    return res.status(200).json(products);
  } catch (e) {
    console.error(e);
    const status = e.statusCode || 500;
    return res.status(status).json({ error: e.message });
  }
}

export async function searchByName(req, res) {
  try {
    const { name } = req.query;
    const products = await searchByNameService(name);
    return res.status(200).json(products);
  } catch (e) {
    console.error(e);
    const status = e.statusCode || 500;
    return res.status(status).json({ error: e.message });
  }
}

export async function getProductById(req, res) {
  try {
    const { id } = req.params;
    const product = await getProductByIdService(id);
    return res.status(200).json(product);
  } catch (e) {
    console.error(e);
    const status = e.statusCode || 500;
    return res.status(status).json({ error: e.message });
  }
}
