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
  // res.sendFile(path.join(__dirname, 'public', 'index.html'));
  res.send(`
  <!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Anime Api</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4bw+/aepP/YC94hEpVNVgiZdgIC5+VKNBQNGCHeKRQN+PtmoHDEXuppvnDJzQIu9" crossorigin="anonymous">
  </head>
  <body class="bg-black">
    <div class="container mt-5">
        <ul class="list-group">
            <li class="list-group-item bg-dark text-white"><h3>API ANIME PRODUCT <span class="" style="font-size: 15px;">By : alongkon</span></h3></li>
            <li class="list-group-item list-group-item-dark">For get all product :  <a class="link-opacity-75-hover" href="https://alongkonproductapi.vercel.app/product">https://alongkonproductapi.vercel.app/product</a> </li>
            <li class="list-group-item list-group-item-dark">For get 1 product with id : <a class="link-opacity-75-hover" href="https://alongkonproductapi.vercel.app/product/1">https://alongkonproductapi.vercel.app/product/1</a></li>
            <li class="list-group-item list-group-item-dark">For search item in product : <a class="link-opacity-75-hover" href="https://alongkonproductapi.vercel.app/products/search?q=kagu">https://alongkonproductapi.vercel.app/products/search?q=kagu</a></li>
          </ul>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-HwwvtgBNo3bZJJLYd8oVXjrBZt8cqVSpeBNS5n7C8IVInixGAoxmnlMuBnhbgrkm" crossorigin="anonymous"></script>
  </body>
</html>
  `)
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
  res.send(`
  <!DOCTYPE html>
<html lang="en">
<head>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4bw+/aepP/YC94hEpVNVgiZdgIC5+VKNBQNGCHeKRQN+PtmoHDEXuppvnDJzQIu9" crossorigin="anonymous">
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Data Collection Form</title>
</head>
<body>

  <form action="/submit" method="post" class="container">
    <h1>เพิ่มข้อมูลใน API</h1>
    <label for="id">ID:</label>
    <input type="text" id="id" name="id" required class="form-control shadow-none"><br>
    <label for="title">Title:</label>
    <input type="text" class="form-control shadow-none" id="title" name="title" required><br>
    <label for="image">Image:</label>
    <input type="text" class="form-control shadow-none" id="image" name="image" required><br>
    <label for="studios">Studios:</label>
    <input type="text" class="form-control shadow-none" id="studios" name="studios" required><br>
    <button type="submit" class="btn btn-success">Submit</button>
  </form>
</body>
</html>

  
  `)
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
