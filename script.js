const rankingContainerElement = document.getElementById("ranking-container");
const statsTotalNb = document.getElementById("stat-total-count");

const sourcePath = 'http://localhost:8000/api'
const pathData = `${sourcePath}/tisane-data`;
const saveData = `${sourcePath}/save-ratings`;

var tisaneRatings = {};
var tisaneRatingsClean = {};
var tisaneSaveBtn = {};
var tisaneClearBtn = {};

let data;



const fetchData = async () => {
  

  try {
    const res = await fetch(pathData);
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
  const idLst = data.map((el) => parseInt(el["id_product"]));
  
  idLst.forEach((idVal) => {
    const ratingForm = document.getElementById(`tisane-${idVal}-rating-form`);
    tisaneRatings[idVal] = ratingForm;
    tisaneRatingsClean[idVal] = ratingForm.style["cssText"] !== "" ? parseFloat(ratingForm.style["cssText"].split(": ")[1]) : 0;

    tisaneSaveBtn[idVal] = document.getElementById(`tisane-${idVal}-save-btn`);
    tisaneClearBtn[idVal] = document.getElementById(`tisane-${idVal}-clear-btn`);

    tisaneClearBtn[idVal].addEventListener('click', () => {
      tisaneRatings[idVal].style["cssText"] = "";
      tisaneRatingsClean[idVal] = 0;

      fetch(saveData, {
        method: "POST",
        body: JSON.stringify(tisaneRatingsClean),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        },
      });
    });

    tisaneSaveBtn[idVal].addEventListener('click', () => {
      const styleTxt = tisaneRatings[idVal].style["cssText"]; 
      tisaneRatingsClean[idVal] = styleTxt !== "" ? parseFloat(styleTxt.split(": ")[1]) : 0;

      fetch(saveData, {
        method: "POST",
        body: JSON.stringify(tisaneRatingsClean),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        },
      });

    });
  });
};



const makeStats = (data) => {
  const totalNb = data.length;
  statsTotalNb.textContent += totalNb;
};





fetchData();

