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
  router.get('/', controller.home.index);

  router.post('/query', controller.home.index);

  app.beforeStart(async () => {
    const mysql = app.config.mysql;
    const informationSchema = app.mysql.createInstance(mysql.informationSchema);
    const database = mysql.client.database;
    const table = await informationSchema.query(` SELECT a.* FROM TABLES a where a.TABLE_SCHEMA = '${database}'`);
    const column = await informationSchema.query(` SELECT a.* FROM COLUMNS a  WHERE a.TABLE_NAME in (SELECT a.TABLE_NAME   FROM TABLES a where a.TABLE_SCHEMA = '${database}')`);
    dbInfo.setDbInfoConfig({ table, column });
    console.log({ table, column });
  });


};
