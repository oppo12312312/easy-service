'use strict';
const Service = require('egg').Service;

class home extends Service {
  async list() {
    const test = await this.app.mysql.query('SELECT * FROM test  ');
    // console.log(this.ctx.req.payload);
    // console.log(this.ctx);
    // console.log(this.ctx.params);
    // console.log(this.ctx.queries);
    // console.log(this.ctx.query);
    // let str = '';
    // this.ctx.req.on('data', function(chunk) {
    //   str += chunk;
    // });
    // this.ctx.req.on('end', function() {
    //   console.log(str);
    // });

    // this.app.foo();
    console.log(this.ctx.request.body);
    return test;
  }
}

module.exports = home;
