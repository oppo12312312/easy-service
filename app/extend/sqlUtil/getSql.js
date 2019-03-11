/*
 * @Description:
 * @Author: zhongshuai
 * @LastEditors: zhongshuai
 * @Date: 2019-02-20 14:03:16
 * @LastEditTime: 2019-03-11 16:08:40
 */

'use strict';
const base = require('./base');
const verify = require('./verify');
const dbInfo = require('./dbInfo');
const otherName = 'a';


module.exports = {
  getSelectSqlByParam(param) {
    verify.verifySelectParam(param);
    return this.getSelectSql(param.tableName, param.where || {}, param.columns || [], param.orders || [], param.pageNum || 0, param.pageSize || 0);
  },
  getSelectSql(tableName, where = {}, columns = [], orders = [], pageNum = 1, pageSize = 10000) {
    verify.verifySelect(tableName, where, columns, orders, pageNum, pageSize);
    const lintTableName = base.toLine(tableName);
    const sqlTableName = base.getSqlTableName(tableName, otherName);
    if (columns.length === 0) {
      // 不传入columns 则查询表中的所有字段
      columns = dbInfo.getAllColumn(lintTableName);
      columns = columns.map(att => {
        return base.toHump(att);
      });
    }
    const sqlColumns = base.getSqlColumnQuery(tableName, columns, otherName);
    const sqlWhere = base.getSqlWhere(where, otherName, tableName);
    const sqlOrder = base.getSqlOrders(tableName, orders, otherName);
    const sqlPage = base.getPage(pageNum, pageSize);
    return `select ${sqlColumns} from ${sqlTableName} where ${sqlWhere} ${sqlOrder} ${sqlPage}`;
  },
  getUpdateSqlByParam(param) {
    verify.verifySelectParam(param);
    verify.verifyUpdataData(param.data);
    return this.getUpdateSql(param.tableName, param.data || [], param.where || {});
  },
  // getUpdateSql(tableName, data, where) {

  // },
  // getDeleteSql(tableName, where) {

  // },
  // getInsetSql(tableName, data) {

  // },
};
