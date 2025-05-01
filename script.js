const rankingContainerElement = document.getElementById("ranking-container");
const statsTotalNb = document.getElementById("stat-total-count");

let data;
const fetchData = async (path) => {
  try {
    const res = await fetch(path);
    data = await res.json();
    
    data.forEach((tisane) => { 
      const tisaneData = orderTisaneData(tisane); 
      displayTisanes(tisaneData);
    });
    makeStats(data);
  } catch (err) {
    console.log("Fetching data failed");
  }
};


const orderTisaneData = (dataElement) => {
  const tisaneMetaData = {};
  tisaneMetaData["name"] = dataElement["name"];
  tisaneMetaData["picURL"] = dataElement["cover"]["large"]["url"];
  tisaneMetaData["id"] = dataElement["id_product"];
  return tisaneMetaData;
};



const displayTisanes = (tisaneData) => {
  rankingContainerElement.innerHTML += `
  <div id="tisane-${tisaneData['id']}" class="tisane-card">
    <img class="tisane-pic" src="${tisaneData["picURL"]}">
    <div class="tisane-card-bar"></div>
    <h2 class="tisane-card-name">${tisaneData['name']}</h2>
    <div class="card-rating-block">
      <div id="tisane-${tisaneData['id']}-rating" class="current-rating"></div>
      <button type="button" class="tisane-card-rating-btn">Add rating</button>
    </div>
  </div>
  `;
};



const makeStats = (data) => {
  const totalNb = data.length;
  statsTotalNb.textContent += totalNb;
};





fetchData('http://localhost:8000/data/liste-tisanes.json');

