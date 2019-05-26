/*
 * @Description:
 * @Author: zhongshuai
 * @LastEditors: zhongshuai
 * @Date: 2019-02-15 16:59:54
 * @LastEditTime: 2019-05-26 16:57:48
 */
'use strict';
const Service = require('egg').Service;
const mysqlEasySql = require('mysql-easy-sql');

class home extends Service {
  async query() {
    const param = this.ctx.request.body;
    // const sql = this.app.getSelectSqlByParam(param);
    const sql2 = mysqlEasySql.getSelectSqlByParam(param);
    console.log(sql2);
    const test = await this.app.mysql.query(sql2);
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
