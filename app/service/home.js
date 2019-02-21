'use strict';
const Service = require('egg').Service;

class home extends Service {
  async list() {
    // const test = await this.app.mysql.query('SELECT * FROM test  ');
    this.app.foo();
    return this.app.dbInfoConfig;
  }
}

module.exports = home;
