'use strict';
const dbTableName = 'TABLE_NAME';
const dbColumnName = 'COLUMN_NAME';
const dbDataType = 'DATA_TYPE';
const dbDataTypes = {
  number: [ 'tinyint', 'smallint', 'mediumint', 'int', 'bigint', 'float', 'double' ],
  string: [ 'char', 'varchar', 'tinytext', 'text', 'mediumtext', 'longtext' ],
  dateTime: [ 'dateTime', 'time', 'date' ],
  dateTimeFormat: {
    dateTime: '\'%Y-%m-%d %H:%i:%s\'',
    time: '\'%H:%i:%s\'',
    date: '\'%Y-%m-%d\'',
  },
};
const sqlKeys = [ '=', '!=', '>', '>=', '<', '<=', 'between', 'not between', 'like', 'is', 'in' ];
const descAsc = [ 'desc', 'asc' ];
let dbInfoConfig = {};

module.exports = {
  dbDataTypes,
  sqlKeys,
  descAsc,
  /**
   * 查询字段的类型
   * @param {String} tableName 表名称
   * @param {String} columnName 字段名称
   * @return {String} dataType 字段类型
   */
  getColumnType(tableName, columnName) {
    let dataType = '';
    const columnCfg = dbInfoConfig.column;
    columnCfg.forEach(attr => {
      if (attr[dbTableName].toUpperCase() === tableName.toUpperCase() && attr[dbColumnName].toUpperCase() === columnName.toUpperCase()) {
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
    return !(this.getColumnType(tableName, columnName) === '');
  },
  /**
   * 返回表是否存在
   * @param {string} tableName  表名称
   * @return {boolean} 是否存在表
   */
  getTableNameExist(tableName) {
    return !(this.getTableName(tableName) === '');
  },
  getTableName(tableName) {
    let result = '';
    const tableCfg = dbInfoConfig.table;
    for (let i = 0; i < tableCfg.length; i++) {
      const attr = tableCfg[i];
      if (attr[dbTableName].toUpperCase() === tableName.toUpperCase()) {
        result = attr[dbTableName];
        break;
      }
    }
    return result;
  },
  /**
   * 某一个表中所有的字段
   * @param {string} tableName  表名称
   * @return {Array} 字段数组
   */
  getAllColumn(tableName) {
    const columns = [];
    const columnCfg = dbInfoConfig.column;
    columnCfg.forEach(attr => {
      if (attr[dbTableName].toUpperCase() === tableName.toUpperCase()) {
        columns.push(attr[dbColumnName]);
      }
    });
    return columns;
  },
  getColumn(tableName, colnum) {
    let dbCloumn = '';
    const columns = this.getAllColumn(tableName);
    for (let i = 0; i < columns.length; i++) {
      const att = columns[i];
      if (att.toUpperCase() === colnum.toUpperCase()) {
        dbCloumn = att;
        break;
      }
    }
    return dbCloumn;
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
  setDbInfoConfig(value) {
    dbInfoConfig = value;
  },

};

