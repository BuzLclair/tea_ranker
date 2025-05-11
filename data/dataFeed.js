const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
// const open = require('open');

const app = express();

app.use(express.json());
app.use(cors());



const readJsonFile = (filePath) => {
  const file = fs.readFileSync(filePath); 
  return JSON.parse(file);
};

async function scrapeSite(url) {
  const response = await axios.get(url);
  return response["data"]["products"];
}


app.get('/api/tisane-data', (req, res) => {
  const url = "https://www.les2marmottes.com/fr/10-infusions-et-thes";
  const tisaneData = scrapeSite(url).then(
      (data) => res.json(data));
});


app.post('/api/save-ratings', (req, res) => {
  const rankingDataPath = path.join(__dirname, 'ranking-tisanes.json');
  fs.writeFileSync(rankingDataPath, JSON.stringify(req.body, null, 2))
});



app.post('/api/get-ratings', (req, res) => {
  const rankingDataPath = path.join(__dirname, 'ranking-tisanes.json');
  const idsList = req.body;
  let ratingsData;

  try {
    ratingsData = readJsonFile(rankingDataPath); 
  } catch (err) {
    ratingsData = {};
  };
   
  const idsInFile = Object.keys(ratingsData);
  const missingIds = idsList.filter((el) => !idsInFile.includes(el)); 
  
  missingIds.forEach((id) => ratingsData[id] = 0);

  fs.writeFileSync(rankingDataPath, JSON.stringify(ratingsData, null, 2));
  res.json(ratingsData);
});



// app.get('/', (req, res) => {
//   const htmlPagePath = '/../tisanes-ranker-webpage.html';
//   res.sendFile(htmlPagePath);
// });


app.listen(8000, () => {
  // open('http://localhost:8000');
  console.log("Server running on port 8000");
});

