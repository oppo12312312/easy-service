
'use strict';
const param = {
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


module.exports = {
  // getSelectSql(tableName, where = {}, columns = [], orders = [], pageNum = 0, pageSize = 0) {


  // },
  // getUpdateSql(tableName, data, where) {

  // },
  // getDeleteSql(tableName, where) {

  // },
  // getInsetSql(tableName, data) {

  // },
  foo() {
    // throw new Error('找不到表');
  },
};
