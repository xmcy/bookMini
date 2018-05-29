const app = getApp();
const tools = require('../../utils/tools.js');
Page({
  data: {
    bookNewsList: []
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '消息'
    });
  },
  onShow: function () {
    var that = this;
    var userid = app.globalData.userId;
    console.log(userid)
    if (userid) {
      tools.wxRequest({
        url: 'torequest',
        method: 'GET',
        header: {
          'content-type': 'multipart/form-data'
        },
        data: {
          ownerid: 6,
          status: 0
        },
        success: function (res) {
          console.log(res.data.data)
          var data = res.data.data;
          var bookNewsList = [];
          // for(var i in data){
          var book = app.globalData.book;
          console.log(book)
            bookNewsList.push(book);
            that.setData({
              bookNewsList: bookNewsList
            })
          // }
        }
      })
    }
  },
  toBorrowBookDetail: function (e) {
    var that = this;
    var bookstoreid = e.currentTarget.dataset.bookstoreid;
    console.log(bookstoreid)
    var ownerid = e.currentTarget.dataset.ownerid;
    var bookNewsList = that.data.bookNewsList;
    var borrowBookList = {};
    for(var i in bookNewsList){
      if (bookstoreid == bookNewsList[i].id){
        borrowBookList = bookNewsList[i]
      }
    } 
    borrowBookList = JSON.stringify(borrowBookList)
    wx.navigateTo({
      url: '../borrowBookDetail/borrowBookDetail?ownerid=' + ownerid + '&bookstoreid=' + bookstoreid + '&borrowBookList=' + borrowBookList,
    })
  },
})