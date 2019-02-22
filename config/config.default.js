'use strict';
const mysql = require('./config.egg-mysql');
module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1544694579547_5065';

  config.serverTimeout = 200000;


  // add your config here
  config.middleware = [];

  config.mysql = mysql;

  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true,
    },
    domainWhiteList: [ '*' ],
  };

  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };


  return config;
};
