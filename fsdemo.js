const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "onlyrevies.js");

try {
  const data = fs.readFileSync(dir, "utf-8");
  const jsonData = JSON.parse(data);
  const newData = jsonData.map((elem) => ({
    ...elem,
    images: elem.images.length,
  }));
  console.log(JSON.stringify(newData).length);
} catch (error) {
  console.error(error);
}
