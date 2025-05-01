import axios from "axios";
import fs from "fs";



const JSONToFile = (obj, filename) => {
  fs.writeFileSync(`${filename}.json`, JSON.stringify(obj, null, 2))
};


async function scrapeSite(url) {
  const data = await axios.get(url);
  const clean_data = await data["data"]["products"];
  await JSONToFile(clean_data, './data/liste-tisanes');
}

const url = "https://www.les2marmottes.com/fr/10-infusions-et-thes";
scrapeSite(url);

