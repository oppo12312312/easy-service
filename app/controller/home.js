/*
 * @Description:
 * @Author: zhongshuai
 * @LastEditors: zhongshuai
 * @Date: 2018-12-13 17:49:58
 * @LastEditTime: 2019-05-24 18:01:28
 */
'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async query() {
    this.ctx.body = await this.ctx.service.home.query();
  }
  async update() {
    this.ctx.body = await this.ctx.service.home.update();
  }
  async inset() {
    this.ctx.body = await this.ctx.service.home.inset();
  }

  async delete() {
    this.ctx.body = await this.ctx.service.home.delete();
  }
}

module.exports = HomeController;
