const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory demo data
const products = [
  {
    id: 'p1',
    name: 'Classic T-Shirt',
    description: 'Soft cotton t-shirt with a timeless fit.',
    price: 19.99,
    image: 'https://picsum.photos/id/1011/600/400',
    category: 'Apparel',
    rating: 4.5,
  },
  {
    id: 'p2',
    name: 'Wireless Headphones',
    description: 'Noise-cancelling over-ear headphones with 20h battery.',
    price: 89.99,
    image: 'https://picsum.photos/id/180/600/400',
    category: 'Electronics',
    rating: 4.6,
  },
  {
    id: 'p3',
    name: 'Ceramic Mug',
    description: 'Hand-finished mug, microwave and dishwasher safe.',
    price: 12.5,
    image: 'https://picsum.photos/id/1080/600/400',
    category: 'Home & Kitchen',
    rating: 4.3,
  },
  {
    id: 'p4',
    name: 'Canvas Backpack',
    description: 'Durable canvas backpack with padded laptop sleeve.',
    price: 59.0,
    image: 'https://picsum.photos/id/250/600/400',
    category: 'Accessories',
    rating: 4.4,
  },
];

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/products', (_req, res) => {
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

app.post('/api/orders', (req, res) => {
  const { items, customer } = req.body || {};
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Order items are required' });
  }

  const detailedItems = items.map((it) => {
    const product = products.find((p) => p.id === it.productId);
    return {
      productId: it.productId,
      name: product ? product.name : 'Unknown',
      unitPrice: product ? product.price : 0,
      quantity: Number(it.quantity) || 1,
      lineTotal: (product ? product.price : 0) * (Number(it.quantity) || 1),
    };
  });

  const subtotal = detailedItems.reduce((sum, it) => sum + it.lineTotal, 0);
  const shipping = subtotal > 100 ? 0 : 6.99;
  const tax = +(subtotal * 0.07).toFixed(2);
  const total = +(subtotal + shipping + tax).toFixed(2);

  const orderId = 'ord_' + Math.random().toString(36).slice(2, 10);
  const response = {
    orderId,
    customer: customer || null,
    items: detailedItems,
    amounts: { subtotal, shipping, tax, total },
    status: 'received',
  };

  res.status(201).json(response);
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
