const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3005;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const productsFilePath = path.join(__dirname, 'productsjson.json');

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/products', (req, res) => {
  try {
    const productsData = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));
    res.status(200).json(productsData);
  } catch (err) {
    console.error('Error reading products data:', err);
    res.status(500).send('An error occurred.');
  }
});

app.get('/products/search', (req, res) => {
  const searchTerm = req.query.q;
  try {
    const productsData = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));
    const searchResults = productsData.filter(product => {
      return product.title.toLowerCase().includes(searchTerm.toLowerCase());
    });
    res.status(200).json(searchResults);
  } catch (err) {
    console.error('Error searching products:', err);
    res.status(500).send('An error occurred.');
  }
});

app.post('/submit', (req, res) => {
  const { id, title, image, studios } = req.body;
  const newData = { id, title, image, studios }


  try {
    const existingData = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));
    const newDataArray = existingData.concat(newData);

    fs.writeFileSync(productsFilePath, JSON.stringify(newDataArray, null, 2));

    res.send('Data saved successfully.');
    history.back()
  } catch (err) {
    console.error('Error appending data:', err);
    res.status(500).send('An error occurred.');
  }
});
app.get('/addproduct', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'add_data.html'));
});

app.get('/products/:id', (req, res) => {
  const productId = req.params.id;
  try {
    const productsData = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));
    const product = productsData.find(item => item.id === productId);

    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).send('An error occurred.');
  }
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
