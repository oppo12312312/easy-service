/*
 * @Description:
 * @Author: zhongshuai
 * @LastEditors: zhongshuai
 * @Date: 2019-02-15 16:59:54
 * @LastEditTime: 2019-03-29 17:57:13
 */
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
  async update() {
    const param = this.ctx.request.body;
    const sql = this.app.getUpdateSqlByParam(param);
    console.log(sql);
    const test = await this.app.mysql.query(sql);
    return test;
  }
}

module.exports = home;
