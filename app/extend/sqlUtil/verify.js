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
      if (base.valueType(all[key]) !== verifyType[key]) {
        throw new Error(`${key}字段只能是(${verifyType[key]})类型`);
      }
    }
    this.verifyTableName(tableName);
    this.verifyWhere(tableName, where);
    this.verifyColumns(tableName, columns);
    this.verifyOrders(tableName, orders);
    this.verifyPage(pageNum, pageSize);
  },
  /**
   * 校验SelectParam参数
   * @param {Object} param SelectParam
   */
  verifySelectParam(param) {
    if (base.valueType(param) !== 'object') {
      throw new Error('select的param参数必须是一个object');
    }
    if (!param.tableName) {
      throw new Error('select的param中必须包含tableName字段');
    }
  },
  verifyColumns(tableName, columns) {
    columns.forEach(attr => {
      this.verifyColumn(tableName, attr, 'columns');
    });
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
      throw new Error(`${type}中的 ${column}(${lineKey}) 在表 ${tableName}(${lineTableName}) 中不存在`);
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
  /**
   * 校验 pageNum，pageSize
   * @param {number} pageNum  大于0
   * @param {number} pageSize  大于0
   */
  verifyPage(pageNum, pageSize) {
    const page = { pageNum, pageSize };
    for (const key in page) {
      if (base.valueType(page[key]) !== 'number' || !/^\d+$/.test(page[key] + '') || page[key] < 1) {
        new Error(`${key}必须是大于0的整数`);
      }
    }
  },

};
