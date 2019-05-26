/*
 * @Description:
 * @Author: zhongshuai
 * @Date: 2019-05-26 22:10:26
 * @LastEditors: zhongshuai
 * @LastEditTime: 2019-05-26 22:11:38
 */
// server.js
'use strict';
const egg = require('egg');

const workers = Number(process.argv[2] || require('os').cpus().length);
egg.startCluster({
  workers,
  baseDir: __dirname,
});
