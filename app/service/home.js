/*
 * @Description:
 * @Author: zhongshuai
 * @LastEditors: zhongshuai
 * @Date: 2019-02-15 16:59:54
 * @LastEditTime: 2019-05-24 18:12:49
 */
'use strict';
const Service = require('egg').Service;

class home extends Service {
  async query() {
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
  async inset() {
    const param = this.ctx.request.body;
    const sql = this.app.getInsetSqlByParam(param);
    console.log(sql);
    const test = await this.app.mysql.query(sql);
    return test;
  }
  async delete() {
    const param = this.ctx.request.body;
    const sql = this.app.getDeleteSqlByParam(param);
    console.log(sql);
    const test = await this.app.mysql.query(sql);
    return test;
  }
}

module.exports = home;
