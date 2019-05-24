/*
 * @Description:
 * @Author: zhongshuai
 * @LastEditors: zhongshuai
 * @Date: 2018-12-13 17:49:58
 * @LastEditTime: 2019-04-07 19:42:12
 */
'use strict';

const Controller = require('egg').Controller;
const Readable = require('stream').Readable;
function RR() {
  Readable.call(this, arguments);
}
RR.prototype = new Readable();
RR.prototype._read = function() {
};
const sse = (stream, event, data) => {
  return stream.push(`event:${event}\ndata: ${JSON.stringify(data)}\n\n`);
//    return stream.write(`event:${ event }\ndata: ${ JSON.stringify(data) }\n\n`);
};
class test extends Controller {
  async eventSource() {
    const stream = new RR();// PassThrough();
    this.ctx.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });
    sse(stream, 'test', { a: 'yango', b: 'tango' });
    this.ctx.body = stream;
    setInterval(() => {
      sse(stream, 'test', { a: 'yango', b: Date.now() });
    }, 3000);
  }
}

module.exports = test;
