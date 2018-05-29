const app = getApp()
const tools = require('../../utils/tools.js');
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    uploadList: [
      {
        id: 22,
        ownerid: 6,
        author: "端木赐香",
        isbn: "7568010201,9787568010207",
        image: "https://img3.doubanio.com/view/subject/m/public/s29096354.jpg", 
        title: "这一次，我们又挨打了",
        summary: "从哪里跌倒，就从哪里站起来。作者以一种据为人的冷静和客观角度，对第二次鸦片战争做了全方位的解读。书中披露了诸多鲜为人知的历史细节，告诉你历史的真相，在述说大清挨打的同事，更多地给英法美等施暴者一个符合逻辑的圆满的解释。本书颠覆了主观视角，审视那些令我们蒙辱的历史事件和人物。"
      },
      {
        id: 21,
        ownerid: 7,
        author: "George Coulouris",
        isbn: "7111224388,9787111224389",
        image: "https://img3.doubanio.com/view/subject/m/public/s26031166.jpg",
        title: "分布式系统概念与设计",
        summary: "《分布式系统概念与设计》旨在全面介绍因特网及其他常用分布式系统的原理、体系结构、算法和设计，内容涵盖分布式系统的相关概念、安全、数据复制、组通信、分布式文件系统、分布式事务等，以及相关的前沿主题，包括web服务、网格、移动系统和无处不在系统等。"
      }
    ],
  },
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: '发现'
    });
    wx.login({
      success: function (res) {
        if (res.code) {
          tools.wxRequest({
            url: "user/weixin/code/"+res.code,
            method: "POST",
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              var data = res.data.data;
              app.globalData.userId = data.id;
              app.globalData.openid = data.openid;
              that.wxUserLogin(data.openid)
            },
            fail: function (res) {
              console.log(res);
            },
          });
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
    // 获取用户信息
    if (app.globalData.userInfo) {
      that.setData({
        hasUserInfo: true,
      })
      var detail = app.globalData.detail;
      // that.saveUserInfo(detail)
    } else if (this.data.canIUse) {
      app.userInfoReadyCallback = res => {
        that.setData({
          hasUserInfo: true
        })
        // that.saveUserInfo(res)
      }
    } else {
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onShow: function() {
    var that = this;
    if (app.globalData.userId){
      var userId = app.globalData.userId;
      // that.getLatestUpload(userId)
    }
  },
  // 获取最新动态
  getLatestUpload: function (userId) {
    var that = this;
    var uploadList = that.data.uploadList;
    tools.wxRequest({
      url: "book/getLatestUpload/",
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {
        id: userId
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          uploadList: res.data
        })
      },
      fail: function (res) {
        console.log(res);
      },
    });
  },
  // 申请借书
  toBookDetails: function (e) {
    var that = this;
    var ownerid = e.currentTarget.dataset.bookownerid;
    var bookId = e.currentTarget.dataset.bookid;
    var uploadList = that.data.uploadList;
    var borrowBookList = {};
    for (var i in uploadList){
      if (bookId == uploadList[i].id){
        borrowBookList = uploadList[i]
      }
    }
    console.log(borrowBookList)
    borrowBookList = JSON.stringify(borrowBookList);
    // var bookownerId = e.currentTarget.dataset.bookownerid;
    // var bookshelfId = e.currentTarget.dataset.bookshelfid;
    wx.navigateTo({
      url: '../bookDetails/bookDetails?ownerid=' + ownerid + '&borrowBookList=' + borrowBookList,
    })
  },
  getUserInfo: function (e) {
    var that = this;
    app.globalData.detail = e.detail;
    app.globalData.userInfo = e.detail.userInfo;
    that.saveUserInfo(e.detail)
    that.setData({
      hasUserInfo: true
    })
  },
  // 保存微信用户信息
  saveUserInfo: function (detail) {
    tools.wxRequest({
      url: "v1/auth/wx/userInfo",
      method: "PUT",
      data: {
        userInfo: detail.userInfo,
        rawData: detail.rawData,
        signature: detail.signature,
        encryptedData: detail.encryptedData,
        iv: detail.iv,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res)
      },
      fail: function (res) {
        console.log(res);
      },
    });
  },
  // 用户登录
  wxUserLogin: function (openid) {
    tools.wxRequest({
      url: "user/weixin/login",
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      data: {
        openid: openid 
      },
      success: function (res) {
        var data = res.data.data;
        console.log(res)
      },
      fail: function (res) {
        console.log(res);
      },
    });
  }
})