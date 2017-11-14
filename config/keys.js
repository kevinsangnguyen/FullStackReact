// keys.js - figure out what set of credentials to return
if (process.env.NODE_ENV === "production") {
  //in production -return prod set of keys
  module.exports = require("./prod");
} else {
  // dev env - return dev keys
  module.exports = require("./dev");
}
