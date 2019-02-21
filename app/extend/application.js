// app/extend/application.js
'use strict';
const getSql = require('./sqlUtil/getSql');
module.exports = {
  ...getSql,
};
