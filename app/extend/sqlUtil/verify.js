/*
 * @Description:
 * @Author: zhongshuai
 * @LastEditors: zhongshuai
 * @Date: 2019-02-22 17:41:54
 * @LastEditTime: 2019-03-11 16:09:03
 */
'use strict';
const verifyType = {
  where: 'object',
  columns: 'array',
  orders: 'object',
  pageNum: 'number',
  pageSize: 'number',
  tableName: 'string',
  updateData: 'object',
  insertData: 'array',
};
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
    const all = { tableName, where, columns, orders, pageNum, pageSize };
    this.verifyDataType(all);
    this.verifyTableName(tableName);
    this.verifyWhere(where, tableName);
    this.verifyColumns(tableName, columns);
    this.verifyOrders(tableName, orders);
    this.verifyPage(pageNum, pageSize);
  },
  verifyUpdate(tableName, data, where) {
    const all = { tableName, where, updateData: data };
    this.verifyDataType(all);
    this.verifyWhere(tableName, where);
    this.verifyUpdateData(tableName, data);
  },
  verifyUpdateData(tableName, data) {
    for (const key in data) {
      this.verifyColumn(tableName, key, 'data');
    }
  },
  verifyDataType(value) {
    for (const key in value) {
      if (base.valueType(value[key]) !== verifyType[key]) {
        throw new Error(`${key}字段只能是(${verifyType[key]})类型`);
      }
    }
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
  // verifyUpdateData(data) {

  // },
  verifyColumns(tableName, columns) {
    columns.forEach(attr => {
      this.verifyColumn(tableName, attr, 'columns');
    });
  },
  /**
   * where 传入值的校验
   * @param {Object} where   where
   * @param {String} tableName   tableName
   */
  verifyWhere(where, tableName = '') {
    for (const key in where) {
      const lineKey = base.toLine(key);
      const sqlKeysStr = dbInfo.sqlKeys.join(',');

      if ([ 'string', 'number', 'object', 'array' ].indexOf(base.valueType(where[key])) < 0) {
        throw new Error(`where.${key}(${lineKey}) 是无法使用的数据类型`);
      }
      if (tableName) {
        this.verifyColumn(tableName, key, 'where');
        if ([ 'string', 'number' ].indexOf(base.valueType(where[key])) > -1) {
          this.verifyValue(tableName, key, where[key]);
        }
      }

      if (base.valueType(where[key]) === 'object') {
        for (const sqlKey in where[key]) {
          const lowerKeys = sqlKey.toLowerCase();
          const value = where[key][sqlKey];
          const info = `where.${key}[${sqlKey}]`;
          if (dbInfo.sqlKeys.indexOf(lowerKeys) < 0) {
            throw new Error(`${info} 是无法使用的sql关键字, 请在以下关键字中选择： ${sqlKeysStr}`);
          }
          if (sqlKey.toLowerCase() === 'is' && value.toLowerCase() !== 'null' && value.toLowerCase() !== 'not null') {
            throw new Error(`${info} 只能是null或则not null`);
          }
          if (sqlKey.toLowerCase().indexOf('between') > -1) {
            if (base.valueType(value) !== 'array' || value.length !== 2) {
              throw new Error(`${info} 只能是一个长度为2的array`);
            }
          }
        }
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
      if (dbInfo.descAsc.indexOf(orders[key]) < 0) {
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
  verifyValue(tableName, column, value) {
    const lineTableName = base.toLine(tableName);
    const lineKey = base.toLine(column);
    const info = `${tableName}.${column}.${value}`;
    const valueType = base.valueType(value);
    const columnType = dbInfo.getColumnType(lineTableName, lineKey);
    const types = dbInfo.dbDataTypes;
    if (types.number.indexOf(columnType) > -1 && valueType !== 'number') {
      new Error(`${info} 必须是数字类型`);
    }
    if ((types.string.indexOf(columnType) > -1 || types.dateTime.indexOf(columnType) > -1) && valueType !== 'string') {
      new Error(`${info} 必须是字符串类型`);
    }
  },


};
