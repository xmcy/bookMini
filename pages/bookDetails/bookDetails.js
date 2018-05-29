const app = getApp()
const tools = require('../../utils/tools.js');
Page({
  data: {
   
  },
  onLoad: function (options) {
    var that = this;
    var ownerid = options.ownerid;
    var borrowBookList = JSON.parse(options.borrowBookList);
    if (ownerid && borrowBookList){
      that.setData({
        ownerid: ownerid,
        borrowBookList: borrowBookList
      })
      // that.borrowApply(bookId, userId, bookownerId, bookshelfId);
    }
    wx.setNavigationBarTitle({
      title: '书本详情'
    });
  },
  // 申请借书
  toBorrowBookDetail: function () {
    var that = this;
    var userid = app.globalData.userId;
    // 测试数据----begin
    var userid = 7;
    // 测试数据----end
    var bookstoreid  = 12;
    var letter=""
    var borrowBookList = that.data.borrowBookList;
    tools.wxRequest({
      url: `borrow/request?bookstoreid=${bookstoreid}&userid=${userid}&letter=${letter}`,
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data.data)
        app.globalData.book = res.data.data;
        if(res.data.status == 1){
          wx.showToast({
            title: '申请成功',
            icon: 'success',
            duration: 2000
          })
        }
      },
      fail: function (res) {
        console.log(res);
      },
    });
    // var bookId = borrowBookList.bookId;
    // var bookownerId = borrowBookList.bookownerId;
    // var bookshelfId = borrowBookList.bookshelfId;
    // wx.navigateTo({
    //   url: '../borrowBookDetail/borrowBookDetail?userId=' + userId + '&borrowBookList=' + borrowBookList,
    // })
  },
 
})
