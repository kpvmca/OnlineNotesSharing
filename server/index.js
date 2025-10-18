const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Mock products
const products = [
  { id: 1, name: 'Classic Tee', price: 19.99, image: 'https://picsum.photos/seed/shirt/300/200', description: 'Comfortable cotton tee' },
  { id: 2, name: 'Blue Jeans', price: 49.99, image: 'https://picsum.photos/seed/jeans/300/200', description: 'Stylish denim jeans' },
  { id: 3, name: 'Sneakers', price: 79.99, image: 'https://picsum.photos/seed/sneakers/300/200', description: 'Everyday casual sneakers' },
  { id: 4, name: 'Hoodie', price: 39.99, image: 'https://picsum.photos/seed/hoodie/300/200', description: 'Warm and cozy hoodie' }
];

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const product = products.find(p => p.id === id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

app.post('/api/checkout', (req, res) => {
  const { cart } = req.body;
  if (!Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }
  // Mock total
  const total = cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.id);
    if (!product) return sum;
    return sum + product.price * (item.quantity || 1);
  }, 0);
  res.json({ success: true, total: Number(total.toFixed(2)), orderId: Date.now() });
});

// Serve client build in production
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  const clientBuildPath = path.join(__dirname, '..', 'client', 'dist');
  app.use(express.static(clientBuildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
