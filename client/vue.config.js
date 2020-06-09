const path = require("path");

module.exports = {
  outputDir: path.resolve(__dirname, "../app/dist/") ? "../app/dist/" : "/"
};
