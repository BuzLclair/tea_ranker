const rankingContainerElement = document.getElementById("ranking-container");
const statsTotalNb = document.getElementById("stat-total-count");

var tisaneRatings = {};
var tisaneSaveBtn = {};
var tisaneClearBtn = {};

let data;
const fetchData = async (path) => {
  try {
    const res = await fetch(path);
    data = await res.json();
    
    data.forEach((tisane) => { 
      const tisaneData = orderTisaneData(tisane); 
      displayTisanes(tisaneData);
    });

    customRatingsBtn();
    makeStats(data);

  } catch (err) {
    console.log(err);
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
      <div class="ranking-block">
        <input id="tisane-${tisaneData['id']}-rating-form" class="tisane-rating-form" type="range" min=0 max=5 step=0.5 oninput="this.style='--val:'+this.value" oninput="value=this.value">
        <button id="tisane-${tisaneData['id']}-save-btn" class="save-rating-btn">Save</button>
        <button id="tisane-${tisaneData['id']}-clear-btn" class="clear-rating-btn">Clear</button>
      </div>
    </div>
  </div>
  `;

};


const customRatingsBtn = () => {
  const idLst = data.map((el) => el["id_product"]);
  var tisaneRating = idLst.map((el) => 0);

  idLst.forEach((idVal) => {
    tisaneRatings[idVal] = document.getElementById(`tisane-${idVal}-rating-form`);
    tisaneSaveBtn[idVal] = document.getElementById(`tisane-${idVal}-save-btn`);
    tisaneClearBtn[idVal] = document.getElementById(`tisane-${idVal}-clear-btn`);

    tisaneClearBtn[idVal].addEventListener('click', () => {
      tisaneRatings[idVal].style["cssText"] = "";
    });

    tisaneSaveBtn[idVal].addEventListener('click', () => {
      const styleTxt = tisaneRatings[idVal].style["cssText"]; 
      tisaneRating[idVal] = styleTxt !== "" ? parseFloat(styleTxt.split(": ")[1]) : 0;
      console.log(tisaneRating[idVal]);
    });
  });
};



const makeStats = (data) => {
  const totalNb = data.length;
  statsTotalNb.textContent += totalNb;
};





fetchData('http://localhost:8000/data/liste-tisanes.json');

