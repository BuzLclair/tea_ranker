const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(express.json());
app.use(cors());


app.get('/api/tisane-data', (req, res) => {
    const filePath = path.join(__dirname, 'liste-tisanes.json');

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.status(500).json({ error: 'Failed to read JSON file' });
        } else {
            try {
                const jsonData = JSON.parse(data);
                res.json(jsonData);
            } catch (parseError) {
                console.error('Error parsing JSON:', parseError);
                res.status(500).json({ error: 'Invalid JSON format' });
            }
        }
    });
});



app.post('/api/save-ratings', (req, res) => {
  const rankingDataPath = path.join(__dirname, 'ranking-tisanes.json');
  fs.writeFileSync(rankingDataPath, JSON.stringify(req.body, null, 2))
});




app.listen(8000, () => {
  console.log("Server running on port 8000");
});

