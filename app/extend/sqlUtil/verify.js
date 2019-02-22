'use strict';
const verifyType = {
  where: 'object',
  columns: 'array',
  orders: 'object',
  pageNum: 'number',
  pageSize: 'number',
  tableName: 'string',
};
const descAsc = [ 'desc', 'asc' ];
const dbInfo = require('./dbInfo');
const base = require('./base');
module.exports = {
  /**
   * select 传入值的校验
   * @param {String} tableName   tableName
   * @param {Object} where   where
   * @param {Array} columns  columns
   * @param {Array} orders  orders
   * @param {Number} pageNum  pageNum
   * @param {Number} pageSize pageSize
   */
  verifySelect(tableName, where, columns, orders, pageNum, pageSize) {
    const all = { where, columns, orders, pageNum, pageSize };
    for (const key in all) {
      if (this.valueType(all[key]) !== verifyType[key]) {
        throw new Error(`${key}字段只能是(${verifyType[key]})类型`);
      }
    }
    this.verifyTableName(tableName);
    this.verifyWhere(where);
    this.verifyColumns(columns);
    this.verifyOrders(orders);
  },
  /**
   * where 传入值的校验
   * @param {String} tableName   tableName
   * @param {Object} where   where
   */
  verifyWhere(tableName, where) {
    for (const key in where) {
      const lineKey = base.toLine(key);
      this.verifyColumn(tableName, key, 'where');
      if ([ 'string', 'number', 'object' ].indexOf(typeof where[key]) < 0) {
        throw new Error(`where.${key}(${lineKey}) 是无法使用的数据类型`);
      }
    }
  },
  /**
   * orders 传入值的校验
   * @param {String} tableName   tableName
   * @param {Object} orders   orders
   */
  verifyOrders(tableName, orders) {
    for (const key in orders) {
      this.verifyColumn(tableName, key, 'orders');
      if (descAsc.indexOf(orders[key]) < 0) {
        throw new Error(`orders中的 ${key}.attr[key] 不是desc asc`);
      }
    }
  },
  /**
   * column 传入值的校验
   * @param {String} tableName   tableName
   * @param {Object} column   column
   * @param {Object} type   type
   */
  verifyColumn(tableName, column, type) {
    const lineTableName = base.toLine(tableName);
    const lineKey = base.toLine(column);
    if (!dbInfo.getColumnExist(lineTableName, lineKey)) {
      throw new Error(`${type}中的 ${column}(${lineKey}) 在表 ${tableName}(${lineTableName}) 中不存在，请检查`);
    }
  },
  /**
   * tableName 传入值的校验
   * @param {String} tableName   tableName
   */
  verifyTableName(tableName) {
    const lineTableName = base.toLine(tableName);
    if (!dbInfo.getTableNameExist(tableName)) {
      new Error(`${tableName}( ${lineTableName} ) :数据库中找不到这张表 `);
    }
  },
  valueType(value) {
    let type = typeof value;
    if (type === 'object') {
      if (!isNaN(value.length)) {
        type = 'array';
      }
    }
    return type;

  },
}
;
