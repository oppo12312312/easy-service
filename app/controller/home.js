'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    this.ctx.body = await this.ctx.service.home.list();

    // try {
    //   this.ctx.body = await this.ctx.service.home.list();
    // } catch (err) {
    //   console.log(err);
    //   this.ctx.body = err;
    // }

  }
}

module.exports = HomeController;
