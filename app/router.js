/*
 * @Description:
 * @Author: zhongshuai
 * @LastEditors: zhongshuai
 * @Date: 2018-12-13 17:49:58
 * @LastEditTime: 2019-05-24 18:01:40
 */
'use strict';
const dbInfo = require('./extend/sqlUtil/dbInfo');

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const {
    router,
    controller,
  } = app;
  router.get('/', controller.home.query);

  router.post('/query', controller.home.query);

  router.post('/update', controller.home.update);

  router.post('/inset', controller.home.inset);

  router.post('/delete', controller.home.delete);


  router.get('/eventSource', controller.test.eventSource);

  app.beforeStart(async () => {
    const mysql = app.config.mysql;
    const informationSchema = app.mysql.createInstance(mysql.informationSchema);
    const database = mysql.client.database;
    const table = await informationSchema.query(` SELECT a.* FROM TABLES a where a.TABLE_SCHEMA = '${database}'`);
    const column = await informationSchema.query(` SELECT a.* FROM COLUMNS a  WHERE a.TABLE_NAME in (SELECT a.TABLE_NAME   FROM TABLES a where a.TABLE_SCHEMA = '${database}')`);
    dbInfo.setDbInfoConfig({ table, column });
    // console.log({ table, column });
  });


};
