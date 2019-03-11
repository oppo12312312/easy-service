'use strict';
const Service = require('egg').Service;

class home extends Service {
  async list() {
    const param = this.ctx.request.body;
    const sql = this.app.getSelectSqlByParam(param);
    console.log(sql);
    const test = await this.app.mysql.query(sql);
    return test;
  }
}

module.exports = home;
