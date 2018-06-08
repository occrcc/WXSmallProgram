// var baseUrl = 'http://api1.ejiarens.com:8080/';
var baseUrl = 'https://wxapi.ejiarens.com/';
var util = require('./util.js')
var requestHandler = {
  params: {},
  success: function (res) {
  },
  fail: function (res) {
  },
}

//排序（按value值进行排序后生成arr，再转成str，进行shar1加密）
function sign(arys) {
  var valueString = Object.values(arys).sort().join('');
  var shaString = util.sha1(valueString);
  return shaString + '';
}

//GET请求  
function GET(requestHandler) {
  console.log(requestHandler);
  request('GET', requestHandler);
}

//POST请求  
function POST(requestHandler) {
  request('POST', requestHandler);
}

function request(method, requestHandler) {
  var params = requestHandler.params;
  // params.app_id = "mobile";
  // params.app_key = "XDcsk*zXjdcF53465";
  // params.sign = sign(params);
  // delete (params.app_key);
  console.log(params);
  var url = baseUrl + requestHandler.url;
  if (params.isHeader) {
    url = requestHandler.url;
  }

  console.log('requestUrl: ', url);
  var header = requestHandler.header
  if (!header) {
    header = method === 'GET' ? { 'content-type': 'application/json' } : { 'content-type': 'application/x-www-form-urlencoded' };
  }

  wx.request({
    url: url,
    data: params,
    method: method,
    header: header,
    success: function (res) {
      requestHandler.success(res);
    },
    fail: function (res) {
      requestHandler.fail(res);
    },
    complete: function () {
    }
  })
}

module.exports = {
  GET: GET,
  POST: POST
}  