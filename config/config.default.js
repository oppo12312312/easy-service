'use strict';
const mysql = require('./config.egg-mysql');
module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1544694579547_5065';

  // add your config here
  config.middleware = [];

  config.mysql = mysql;


  return config;
};
