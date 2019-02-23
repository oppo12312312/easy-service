
'use strict';

const dbInfo = require('./dbInfo');
module.exports = {
  /**
   * 通过字段数组获取查询sql的column
   * @param {String} tableName 别名
   * @param {Array} columns 字段
   * @param {String} otherName 别名
   * @return {String}  拼接的sql
   */
  getSqlColumnQuery(tableName, columns, otherName) {
    let tempName = '';
    const arrColumns = [];
    const lintTableName = this.toLine(tableName);
    columns.forEach(att => {
      if (att.indexOf('_') > 0) {
        tempName = this.toHump(att);
        const dbName = dbInfo.getColumn(lintTableName, att);
        arrColumns.push(`${otherName}.\`${dbName}\` ${tempName}`);
      } else {
        tempName = this.toLine(att);
        const dbName = dbInfo.getColumn(lintTableName, att);
        arrColumns.push(`${otherName}.\`${dbName}\` ${att}`);
      }
    });
    return arrColumns.join(' ,');

  },
  /**
   * 通过where对象获取whereSql查询语句
   * @param {String} tableName 表名称
   * @param {Object} where wehre object
   * @param {String} otherName 表别名
   * @return {String} wheresql
   */
  getSqlWhere(tableName, where, otherName) {
    const example = {
      // 比传入字段
      tableName: 'test_table',
      where: {
        dateTime: { '>': 1550216377, '=<': 1550216377 },
        enum: [ 1, 11 ],
        text: { like: '%adf%' },
        id: 1,
      },
      // 不传查询所有
      columns: [ 'enum', 'text' ],
      // 可以不传
      orders: [{ desc: 'id' }],
      pageNum: 1,
      pageSize: 10,
    };
    example;
    const wheres = [];
    const lintTableName = this.toLine(tableName);
    for (const key in where) {
      const values = where[key];
      const column = this.toLine(key);
      const dcColumn = dbInfo.getColumn(lintTableName, column);
      const type = typeof values;
      const columnSql = `${otherName}.\`${dcColumn}\``;
      switch (type) {
        case 'number':
          wheres.push(`${columnSql} = ${values}`);
          break;
        case 'string':
          wheres.push(`${columnSql} = '${values}'`);
          break;
        case 'object':
          // 数组
          if (!isNaN(values.length) && values.length > 0) {
            let inValues = '';
            if (typeof values[0] === 'number') {
              inValues = values.join(' , ');
            } else {
              inValues = "'" + values.join("' , '") + "'";
            }
            wheres.push(`${columnSql}  in (${inValues})`);
          // 对象
          } else {
            for (const ckey in values) {
              if (typeof values[ckey] === 'number') {
                if (dbInfo.isDateTime(lintTableName, key)) {
                  wheres.push(`unix_timestamp(${columnSql})  ${ckey} ${values[ckey]}`);
                } else {
                  wheres.push(`${columnSql}  ${ckey} ${values[ckey]}`);
                }
              }
              if (typeof values[ckey] === 'string') {
                wheres.push(`${columnSql}  ${ckey} '${values[ckey]}'`);
              }
            }
          }
          break;
        default:

      }
    }
    return wheres.join(' and ');
  },
  /**
   * 拼接orders sql
   * @param {String} tableName  tableName
   * @param {Object} orders  orders
   * @param {String} otherName otherName
   * @return {String} 拼接orders sql
   */
  getSqlOrders(tableName, orders, otherName) {
    let sqlOrders = '';
    const sqlOrdersArr = [];
    console.log(orders);
    for (const key in orders) {
      const dbColumn = dbInfo.getColumn(this.toLine(tableName), this.toLine(key));
      sqlOrdersArr.push(`${otherName}.\`${dbColumn}\`  ${orders[key]}`);
    }
    if (sqlOrdersArr.length > 0) {
      sqlOrders = 'order by ' + sqlOrdersArr.join(', ');
    }
    console.log(sqlOrders);
    return sqlOrders;
  },
  /**
   * 获取下划线的表名称
   * @param {String} tableName 驼峰法的表名称
   * @param {String} otherName otherName
   * @return {String} 下划线表名称
   */
  getSqlTableName(tableName, otherName) {
    const name = this.toLine(tableName);
    const dbName = dbInfo.getTableName(name);
    return `${otherName}.\`${dbName}\``;

  },
  /**
   * 下划线转驼峰
   * @param {string} name 下划线字段
   * @return {string} hump
   */
  toHump(name) {
    name = name.toLowerCase();
    return name.replace(/\_(\w)/g, function(all, letter) {
      return letter.toUpperCase();
    });
  },
  /**
   * 驼峰转下划线
   * @param {string} name 驼峰字段
   * @return {string} 下划线字段
   */
  toLine(name) {
    return name.replace(/([A-Z])/g, '_$1').toUpperCase();
  },
  getPage(pageNum, pageSize) {
    const page = (pageNum - 1) * pageSize;
    return `limit ${page} , ${pageSize}`;
  },
  /**
   * 判断值的类型
   * @param {*} value 一个任意类型
   * @return {String} 类型
   */
  valueType(value) {
    let type = typeof value;
    if (type === 'object') {
      if (!isNaN(value.length)) {
        type = 'array';
      }
    }
    return type;
  },
};
