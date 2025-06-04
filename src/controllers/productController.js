import { seedProductsService } from '../services/productService.js';

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
