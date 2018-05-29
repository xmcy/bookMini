const app = getApp();
const tools = require('../../utils/tools.js');
Page({
  data: {
  
  },
  onLoad: function (options) {
    var that = this;
    var ownerid = options.ownerid;
    var bookstoreid = options.bookstoreid;
    var borrowBookList = JSON.parse(options.borrowBookList);
    console.log(borrowBookList)
    if (ownerid && bookstoreid) {
      that.setData({
        ownerid: ownerid,
        bookstoreid: bookstoreid,
        borrowBookList: borrowBookList
      })
    }
    wx.setNavigationBarTitle({
      title: '借书详情'
    });
  },
  agreeApply: function () {
    var that = this;
    var userid = app.globalData.userId;
    userid = 7;
    var ownerid = that.data.ownerid;
    var bookstoreid = that.data.bookstoreid;
    tools.wxRequest({
      url: 'borrow/agree',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        bookstoreid: bookstoreid ,
        userid: userid , 
        ownerid: ownerid
      },
      success: function (res) {
        console.log(res.data.data)
        
      }
    })
  },
  disagreeApply: function () {
    var that = this;
    var userid = app.globalData.userId;
    userid = 7;
    var ownerid = that.data.ownerid;
    var bookstoreid = that.data.bookstoreid;
    tools.wxRequest({
      url: 'borrow/disagree',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        bookstoreid: bookstoreid,
        userid: userid,
        ownerid: ownerid
      },
      success: function (res) {
        console.log(res.data.data)

      }
    })
  }
})