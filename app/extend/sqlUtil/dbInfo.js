'use strict';
const dbTableName = 'TABLE_NAME';
const dbColumnName = 'COLUMN_NAME';
const dbDataType = 'DATA_TYPE';

module.exports = {
  /**
   * 查询字段的类型
   * @param {String} tableName 表名称
   * @param {String} columnName 字段名称
   * @return {String} dataType 字段类型
   */
  getColumnType(tableName, columnName) {
    let dataType = '';
    const columnCfg = this.dbInfoConfig.column;
    columnCfg.forEach(attr => {
      if (attr[dbTableName] === tableName && attr[dbColumnName] === columnName) {
        dataType = attr[dbDataType];
        return dataType;
      }
    });
    return dataType;

  },
  /**
   * 判断字段在表中是否存在
   * @param {String} tableName 表名称
   * @param {String} columnName 字段名称
   * @return {boolean} 是否存在字段
   */
  getColumnExist(tableName, columnName) {
    return this.getColumnType(tableName, columnName) === '';
  },
  /**
   * 返回表是否存在
   * @param {string} tableName  表名称
   * @return {boolean} 是否存在表
   */
  getTableNameExist(tableName) {
    let result = false;
    const tableCfg = this.dbInfoConfig.table;
    tableCfg.forEach(attr => {
      if (attr[dbTableName] === tableName) {
        result = true;
        return result;
      }
    });
    return result;
  },
  /**
   * 某一个表中所有的字段
   * @param {string} tableName  表名称
   * @return {Array} 字段数组
   */
  getAllColumn(tableName) {
    const columns = [];
    const columnCfg = this.dbInfoConfig.column;
    columnCfg.forEach(attr => {
      if (attr[dbTableName] === tableName) {
        columns.push(attr[dbColumnName]);
      }
    });
    return columns;
  },
  /**
     * 是否是时间格式
     * @param {String} tableName 表名称
     * @param {String} columnName 字段名称
     * @return {String} 是否是时间格式
     */
  isDateTime(tableName, columnName) {
    return this.getColumnType(tableName, columnName).indexOf('date') > -1;
  },

};

