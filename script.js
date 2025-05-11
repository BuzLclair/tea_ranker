const rankingContainerElement = document.getElementById("ranking-container");

const statsTotalNb = document.getElementById("stat-total-count");
const statsNbRated = document.getElementById("stat-number-rated");
const statsAvgRating = document.getElementById("stat-avg-rating");

const sourcePath = 'http://localhost:8000/api'
const dataMethods = {
  'pathData': `${sourcePath}/tisane-data`,
  'saveData': `${sourcePath}/save-ratings`,
  'getRatings': `${sourcePath}/get-ratings`,
}


let tisaneRatings = {};
let tisaneRatingsClean = {};
let tisaneSaveBtn = {};
let tisaneClearBtn = {};

let data;
let ratingData;



const fetchData = async () => {
  try {
    const dataPromise = await fetch(dataMethods['pathData']);
    data = await dataPromise.json();    
    
    const idsList = Object.values(data.map((el) => el["id_product"]));
    const ratingDataQuery = await fetch(dataMethods['getRatings'], {
        method: "POST",
        body: JSON.stringify(idsList),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        },
    });
    ratingData = await ratingDataQuery.json();

    data.forEach((tisane) => { 
      const tisaneData = orderTisaneData(tisane, ratingData); 
      displayTisanes(tisaneData);
    });
    customRatingsBtn();
    makeStats(data, ratingData);

  } catch (err) {
    console.log(err);
  }
};



const orderTisaneData = (dataElement, ratingData) => {
  const tisaneMetaData = {};
  const tisaneId = dataElement["id_product"];

  tisaneMetaData["name"] = dataElement["name"];
  tisaneMetaData["picURL"] = dataElement["cover"]["large"]["url"];
  tisaneMetaData["id"] = tisaneId;
  tisaneMetaData["description"] = dataElement["description_short"];

  tisaneMetaData["rating"] = typeof ratingData[tisaneId] !== "undefined" ? ratingData[tisaneId] : 0;
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
        <input id="tisane-${tisaneData['id']}-rating-form" class="tisane-rating-form" type="range" min=0 max=5 step=0.5 
        oninput="this.style='--val:'+this.value" oninput="value=this.value" style="--val: ${tisaneData['rating']};">
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
      tisaneRatings[idVal].style["cssText"] = "--val: 0;";
      ratingData[idVal] = 0;
      makeStats(data, ratingData);


      fetch(dataMethods['saveData'], {
        method: "POST",
        body: JSON.stringify(ratingData),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        },
      });
    });

    tisaneSaveBtn[idVal].addEventListener('click', () => {
      const styleTxt = tisaneRatings[idVal].style["cssText"]; 
      ratingData[idVal] = styleTxt !== "" ? parseFloat(styleTxt.split(": ")[1]) : 0;
      makeStats(data, ratingData);

      fetch(dataMethods['saveData'], {
        method: "POST",
        body: JSON.stringify(ratingData),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        },
      });

    });
  });
};



const makeStats = (data, ratingData) => {
  const totalNb = data.length;
  statsTotalNb.textContent = `# Total: ${totalNb}`;

  const nbRated = Object.values(ratingData).filter((el) => el !== 0);
  statsNbRated.textContent = `# Rated: ${nbRated.length}`;

  const avgRating =  nbRated.length !== 0 ? (nbRated.reduce((a, b) => a + b) / nbRated.length).toFixed(1) : "";
  statsAvgRating.textContent = `Avg rating: ${avgRating}`;
};





fetchData();

