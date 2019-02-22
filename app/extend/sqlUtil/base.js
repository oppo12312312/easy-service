
'use strict';

const dbInfo = require('./dbInfo');
module.exports = {
  /**
   * 通过字段数组获取查询sql的column
   * @param {Array} columns 字段
   * @param {String} otherName 别名
   * @return {String}  拼接的sql
   */
  getSqlColumnQuery(columns, otherName) {
    let tempName = '';
    const arrColumns = [];
    columns.forEach(att => {
      if (att.indexOf('_') > 0) {
        tempName = this.toHump(att);
        arrColumns.push(`${otherName}.\`${att}\` ${tempName}`);
      } else {
        arrColumns.push(`${otherName}.\`${tempName}\` ${att}`);
      }
    });
    return columns.join(' ,');

  },
  /**
   * 通过where对象获取whereSql查询语句
   * @param {*} where wehre object
   * @param {*} tableName 表名称
   * @param {*} otherName 表别名
   */
  getSqlWhere(where, tableName, otherName) {
    const example = {
      // 比传入字段
      tableName: 'test_table',
      where: {
        dateTime: { '>': 1550216377, '=<': 1550216377 },
        enum: [ 1, 11 ],
        text: { like: 'adf' },
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
    for (const key in where) {
      const values = where[key];
      const column = this.toLine(key);
      const type = typeof values;
      const columnSql = `${otherName}.\`${column}\``;
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
                if (dbInfo.isDateTime(tableName, key)) {
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
  },
  /**
   * 拼接orders sql
   * @param {Object} orders  orders
   * @param {String} otherName otherName
   * @return {String} 拼接orders sql
   */
  getSqlOrders(orders, otherName) {
    let sqlOrders = '';
    const sqlOrdersArr = [];
    for (const key in orders) {
      sqlOrdersArr.push(`${otherName}.\`${this.toLine(key)}\` + ' ' + ${orders[key]}`);
    }
    if (sqlOrdersArr.length > 0) {
      sqlOrders = 'order by ' + sqlOrdersArr.join(', ');
    }
    return sqlOrders;
  },
  /**
   * 获取下划线的表名称
   * @param {String} tableName 驼峰法的表名称
   * @return {String} 下划线表名称
   */
  getSqlTableName(tableName) {
    const name = this.toLine(tableName);
    return `'${name}'`;

  },
  /**
   * 下划线转驼峰
   * @param {string} name 下划线字段
   * @return {string} hump
   */
  toHump(name) {
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
    return name.replace(/([A-Z])/g, '_$1').toLowerCase();
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
};
