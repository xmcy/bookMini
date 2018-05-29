const app = getApp();
//本地环境
const baseUrl = "http://47.105.55.56:8080/";

function wxRequest(req) {
  var header = req.header;
  // if (app.globalData.sessionKey){
  //   header['sessionKey'] = app.globalData.sessionKey;
  // }
  wx.request({
    url: baseUrl + req.url,
    data: req.data,
    method: req.method,
    header: header,
    success: function (res) {
      // console.log(res)
      req.success(res);
      // if (res.data.info == "请求成功") {
        
      // }
      // var result = res.data;
    },
    fail: function (res) {
      req.fail(res);
    },
  });
}



module.exports = {
  wxRequest: wxRequest,
};