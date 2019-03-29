/*
 * @Description:
 * @Author: zhongshuai
 * @LastEditors: zhongshuai
 * @Date: 2018-12-13 17:49:58
 * @LastEditTime: 2019-03-29 18:09:41
 */
'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    this.ctx.body = await this.ctx.service.home.list();
  }
  async update() {
    this.ctx.body = await this.ctx.service.home.update();
  }
}

module.exports = HomeController;
