const NodeCache = require('node-cache');

module.exports = new NodeCache({
  stdTTL:      60,
  checkperiod: 1
});
