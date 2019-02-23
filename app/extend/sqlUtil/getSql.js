
'use strict';
const base = require('./base');
const verify = require('./verify');
const otherName = 'a';


module.exports = {
  getSelectSqlByParam(param) {
    verify.verifySelectParam(param);
    return this.getSelectSql(param.tableName, param.where || {}, param.columns || [], param.orders || [], param.pageNum || 0, param.pageSize || 0);
  },
  getSelectSql(tableName, where = {}, columns = [], orders = [], pageNum = 1, pageSize = 10000) {
    verify.verifySelect(tableName, where, columns, orders, pageNum, pageSize);
    const sqlTableName = base.getSqlTableName(tableName, otherName);
    if (columns.length === 0) {
      // 不传入columns 则查询表中的所有字段
      columns = base.getAllColumn();
    }
    const sqlColumns = base.getSqlColumnQuery(tableName, columns, otherName);
    const sqlWhere = base.getSqlWhere(tableName, where, otherName);
    const sqlOrder = base.getSqlOrders(tableName, orders, otherName);
    const sqlPage = base.getPage(pageNum, pageSize);
    return `select ${sqlColumns} from ${sqlTableName} where ${sqlWhere} ${sqlOrder} ${sqlPage}`;
  },
  // getUpdateSql(tableName, data, where) {

  // },
  // getDeleteSql(tableName, where) {

  // },
  // getInsetSql(tableName, data) {

  // },
};
