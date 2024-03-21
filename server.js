const express = require('express');
const fs = require('fs/promises'); // Using promises for async file operations
const app = express();
const port = process.env.PORT || 3005;

const path = require('path'); // For path manipulation
app.use(express.static(path.join(__dirname, '/')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html')); // Or any other file
});

app.use(express.json());

app.post('/save-data', async (req, res) => {
  try {
    const jsonData = req.body;

    let existingData;
    try {
      existingData = await fs.readFile('data.json', 'utf8');
      existingData = JSON.parse(existingData);
    } catch (err) {
      // Handle potential errors reading existing data (e.g., file not found)
      existingData = [];
    }

    existingData.push(jsonData);
    await fs.writeFile('data.json', JSON.stringify(existingData));

    console.log('Data pushed to JSON file');
    res.send('Data saved successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving data'); // More informative error response
  }
});
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

