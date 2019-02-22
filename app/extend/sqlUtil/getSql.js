
'use strict';
const base = require('./base');
const dbInfo = require('./dbInfo');
const verify = require('./verify');


const otherName = 'a';


module.exports = {
  ...dbInfo,
  getSelectSql(tableName, where = {}, columns = [], orders = [], pageNum = 0, pageSize = 0) {
    verify.verifySelect(tableName, where, columns, orders, pageNum, pageSize);
    const sqlTableName = base.getSqlTableName(tableName);
    if (columns.length === 0) {
      // 不传入columns 则查询表中的所有字段
      columns = base.getAllColumn();
    }
    const sqlColumns = base.getSqlColumnQuery(columns, otherName);
    const sqlWhere = base.getSqlWhere(where, otherName);
    const sqlOrder = base.getSqlOrders(orders, otherName);
    return `select ${sqlColumns} from ${sqlTableName} where ${sqlWhere} ${sqlOrder}`;
  },
  // getUpdateSql(tableName, data, where) {

  // },
  // getDeleteSql(tableName, where) {

  // },
  // getInsetSql(tableName, data) {

  // },
};
