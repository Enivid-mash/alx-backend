import express from 'express';
import redis from 'redis';
import { promisify } from 'util';

// **Product Data**

// List of products with initial quantities
const listProducts = [
  {
    itemId: 1,
    itemName: 'Suitcase 250',
    price: 50,
    initialAvailableQuantity: 4,
  },
  // ... other products
];

// Function to get a product by ID
function getItemById(id) {
  return listProducts.find(item => item.itemId === id);
}

// **Redis Configuration**

const client = redis.createClient();
const getAsync = promisify(client.get).bind(client);

// Error and connection handlers for Redis client
client.on('error', (error) => {
  console.error(`Redis client error: ${error.message}`);
});

client.on('connect', () => {
  console.log('Redis client connected');
});

// Function to reserve stock for a product
async function reserveStockById(itemId, stock) {
  await client.set(`item.${itemId}`, stock);
}

// Function to get the current reserved stock for a product
async function getCurrentReservedStockById(itemId) {
  const stock = await getAsync(`item.${itemId}`);
  return parseInt(stock, 10) || 0; // Parse to integer, default to 0 if not found
}

// **Express Server**

const app = express();
const port = 1245;

// Error response for not found products
const notFound = { status: 'Product not found' };

// Error response for insufficient stock
const noStock = { status: 'Not enough stock available', itemId: null };

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

// Endpoint to list all products
app.get('/list_products', (req, res) => {
  res.json(listProducts);
});

// Endpoint to get a specific product by ID
app.get('/list_products/:itemId', async (req, res) => {
  const itemId = Number(req.params.itemId);
  const item = getItemById(itemId);

  if (!item) {
    res.json(notFound);
    return;
  }

  // Get current stock from Redis or use initial quantity if not found
  const currentStock = await getCurrentReservedStockById(itemId);
  item.currentQuantity = currentStock;

  res.json(item);
});

// Endpoint to reserve a product
app.get('/reserve_product/:itemId', async (req, res) => {
  const itemId = Number(req.params.itemId);
  const item = getItemById(itemId);

  if (!item) {
    res.json(notFound);
    return;
  }

  // Get current stock from Redis or use initial quantity if not found
  let currentStock = await getCurrentReservedStockById(itemId);
  if (currentStock === null) {
    currentStock = item.initialAvailableQuantity;
  }

  // Check if there's enough stock
  if (currentStock <= 0) {
    res.json(noStock);
    return;
  }

  // Reserve the product by decrementing the stock in Redis
  await reserveStockById(itemId, currentStock - 1);

  res.json({ status: 'Reservation confirmed', itemId });
});
