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
  tisaneMetaData["description"] = dataElement["description_short"];
  return tisaneMetaData;
};


const extractTxtFromHTML = (txt) => {
  const txtModified = txt.split("</h3")[0] + "</h3>";
  var span = document.createElement('span');
  span.innerHTML = txtModified;
  return span.textContent;
}



const displayTisanes = (tisaneData) => {
  rankingContainerElement.innerHTML += `
  <div id="tisane-${tisaneData['id']}" class="tisane-card">
    <div class="pic-container"><img class="tisane-pic" src="${tisaneData["picURL"]}"></div>
    <div class="tisane-card-bar"></div>
    <h2 class="tisane-card-name">${tisaneData['name']}</h2>
    <div class="tisane-description">${extractTxtFromHTML(tisaneData["description"])}</div>
    <div class="card-rating-block">
      <div class="rating-title">Your rating:</div>
      <div class="ranking-block"><input id="tisane-${tisaneData['id']}-rating-form" class="tisane-rating-form" type="range" min=0 max=5 step=0.5 value=0 oninput="this.style='--val:'+this.value"></div>
    </div>
  </div>
  `;
};



const makeStats = (data) => {
  const totalNb = data.length;
  statsTotalNb.textContent += totalNb;
};





fetchData('http://localhost:8000/data/liste-tisanes.json');

