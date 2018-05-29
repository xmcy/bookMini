const app = getApp();
const tools = require('../../utils/tools.js');
Page({
  data: {
    bookShelfList: [],
    modelHide: true,
    toastHide: true,
    deleteHeaderHide: true,
    bookHeaderHide: false,
    bcList: [
      { text: '所有图书', path: '../../images/bc-select.png', imgHide: false, banShow: true },
      { text: '我的书', path: '../../images/bc-select.png', imgHide: true, banShow: false },
      { text: '借入图书', path: '../../images/bc-select.png', imgHide: true, banShow: false },
      { text: '借出图书', path: '../../images/bc-select.png', imgHide: true, banShow: false }
    ],
    addBookHide: true,
    bookClassifyHide: true,
    classAnimation: {},
    conditionAnimation: {},
    bcListSelect: '所有图书', //默认分类
    bookShelf: {}, //扫描获取的书籍信息
    scancodeModelHide: true,
    /* 借阅条件---begin */
    scaleList: ['天', '周', '月'],
    dateList: ['天', '周', '月'],
    depositValue: 0,
    rentValue: 0,
    maxDateValue: 0,
    scaleIndex: 1,
    dateIndex: 2,
    scaleValue: '周',
    dateValue: '月',
    borrowBookConditionHide: true,
    /* 借阅条件---end */
    bookDelActive: false
  },
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: '书架'
    });
  },
  onShow: function () {
    var that = this;
    var userid = app.globalData.userId;
    if (userid) {
      tools.wxRequest({
        url: 'bookstore/list',
        method: 'GET',
        header: {
          'content-type': 'multipart/form-data'
        },
        data: {
          ownerid: 7,
          status: 0
        },
        success: function (res) {
          console.log(res)
          var data = res.data.data;
          if (data){
            for (var i in data) {
              data[i].delPath = '../../images/b-del-fail.png';
              data[i].delState = false;
              data[i].delHide = true;
            }
            that.setData({
              bookShelfList: data
            })
          }
        }
      })
    }
  },
  getMore: function () {
    var that = this;
    var bookShelf = {};
    wx.scanCode({
      success: (res) => {
        var isbn = res.result;
        console.log(isbn)
        tools.wxRequest({
          url: "book/scan",
          method: "GET",
          data: {
            isbn: isbn
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res.data.data);
            var data = res.data.data;
            bookShelf.book = data;
            bookShelf.bookid = data.id;
            bookShelf.id = data.id;
            bookShelf.delPath = '../../images/b-del-fail.png';
            bookShelf.delState = false;
            bookShelf.delHide = true;
            var bookId = data.id;
            that.setData({
              bookId: bookId,
              isbn: isbn,
              bookShelf: bookShelf,
              scancodeModelHide: false
            })
            console.log(bookShelf)
          },
          fail: function (res) {
            console.log(res);
          },
        });
        
      },
      fail: (res) => {
        console.log(res)
      }
    })
  },
  // 保存用户添加的书籍信息
  saveBook: function () {
    var that = this;
    var userid = app.globalData.userId;
    var isbn = that.data.isbn;
    var bookShelfList = that.data.bookShelfList;
    var bookShelf = that.data.bookShelf;
    tools.wxRequest({
      url: "book/isbn",
      method: "POST",
      data: {
        isbn: isbn,
        userid: userid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        if (res.data.status == 1) {
          bookShelfList.push(bookShelf);
        }
        that.setData({
          bookShelfList: bookShelfList,
          scancodeModelHide: true
        })
        console.log(bookShelfList)
      },
      fail: function (res) {
        console.log(res);
      },
    });
  },
  // 设置图书属性
  saveBookProperty: function () {
    var that = this;
    var userid = app.globalData.userId;
    var bookid = that.data.bookid;
    tools.wxRequest({
      url: "bookstore/set",
      method: "POST",
      data: {
        owerid: userid,
        bookid: bookid,
        days: days,
        fee: fee,
        deposit: deposit 
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        console.log(isbn)
        // if (res.data.info == '请求成功') {
        //   bookShelfList.push(bookShelf);
        // }
        // that.setData({
        //   bookShelfList: bookShelfList,
        //   scancodeModelHide: true
        // })
      },
      fail: function (res) {
        console.log(res);
      },
    });
  },
  // 确定上架
  addBookToShelf: function () {
    var that = this;  
    that.saveBook() 
  },
  // 取消上架
  scancodeModelCancel: function () {
    var that = this;
    that.setData({
      scancodeModelHide: true
    })
  },
  // 点击编辑
  toBookEdit: function () {
    var that = this;
    var bookShelfList = that.data.bookShelfList;
    for (var i in bookShelfList) {
      bookShelfList[i].delHide = false;
    }
    that.setData({
      bookShelfList: bookShelfList,
      bookHeaderHide: true,
      deleteHeaderHide: false
    })
  },
  // 选择要删除的书籍
  selectBook: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var bookShelfList = that.data.bookShelfList;
    var deleteHeaderHide = that.data.deleteHeaderHide;
    var bookDelActive = that.data.bookDelActive;
    if (deleteHeaderHide == false){
      for (var i in bookShelfList) {
        if (i == index) {
          if (bookShelfList[i].delState == false) {
            bookShelfList[i].delPath = '../../images/b-del-succ.png';
            bookShelfList[i].delState = true;
            bookDelActive = true;
          } else {
            bookShelfList[i].delPath = '../../images/b-del-fail.png';
            bookShelfList[i].delState = false;
          }
        }
      }
    }
    that.setData({
      bookShelfList: bookShelfList,
      bookDelActive: bookDelActive
    })
  },
  // 点击删除弹出确认框
  isDeleteBook: function () {
    var that = this;
    var bookShelfList = that.data.bookShelfList;
    var isDelete = false;
    for (var i in bookShelfList) {
      if (bookShelfList[i].delState == true) {
        isDelete = true;
      }
    }
    if (isDelete == true) {
      that.setData({
        modelHide: false
      })
    } else {
      that.setData({
        toastHide: false
      })
      setTimeout(function () {
        that.setData({
          toastHide: true
        })
      }, 2000)
    }
  },
  // 点击移出删除选中书籍
  deleteBook: function () {
    var that = this;
    var bookShelfList = that.data.bookShelfList;
    var ownerid = app.globalData.userId;
    var id = [], delList = [];
    var bookShelf = {};
    for (var i in bookShelfList) {
      if (bookShelfList[i].delState == true) {
        id.push(bookShelfList[i].book.id);
        console.log(id)
        delList.push(i);
      }
      bookShelfList[i].delHide = true;
      bookShelfList[i].delPath = '../../images/b-del-fail.png';
      bookShelfList[i].delState = false;
    }
    console.log(id)
    tools.wxRequest({
      url: "bookstore/out",
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        ownerid: ownerid,
        bookids: id
      },
      success: function (res) {
        console.log(res)
        var data = res.data;
        if(data.status == '1'){
          for (var i in delList){
            bookShelfList.splice(delList[i]);
          }
        }
        that.setData({
          bookShelfList: bookShelfList
        })
      },
      fail: function (res) {
        console.log(res);
      },
    });
    that.setData({
      modelHide: true,
      bookHeaderHide: false,
      deleteHeaderHide: true,
      bookDelActive: false
    })
  },
  deleteBookCancel: function () {
    var that = this;
    that.setData({
      modelHide: true
    })
  },
  // 点击完成
  toBookshelf: function () {
    var that = this;
    var bookShelfList = that.data.bookShelfList;
    for (var i in bookShelfList) {
      bookShelfList[i].delHide = true;
      bookShelfList[i].delPath = '../../images/b-del-fail.png';
      bookShelfList[i].delState = false;
    }
    that.setData({
      bookShelfList: bookShelfList,
      bookHeaderHide: false,
      deleteHeaderHide: true,
      bookDelActive: false
    })
  },
  // 分类---begin
  toBookClassify: function () {
    var that = this;
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateY(600).step()
    that.setData({
      classAnimation: animation.export(),
      bookClassifyHide: false
    })
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        classAnimation: animation.export()
      })
    }, 200)
  },
  getBookClassify: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var bcList = that.data.bcList;
    var bcListSelect;
    for (var i in bcList) {
      if (i == index) {
        bcList[i].imgHide = false;
        bcList[i].banShow = true;
        bcListSelect = bcList[i].text;
      } else {
        bcList[i].imgHide = true;
        bcList[i].banShow = false;
      }
    }
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateY(0).step()
    that.setData({
      classAnimation: animation.export(),
      bookClassifyHide: false
    })
    setTimeout(function () {
      animation.translateY(600).step()
      that.setData({
        classAnimation: animation.export()
      })
    }, 200)
    that.setData({
      bcList: bcList,
      bcListSelect: bcListSelect
    })
  },
  getBookClassifyOver: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  // 新增分类
  addBookShow: function () {
    var that = this;
    var addBookHide = that.data.addBookHide;
    if (addBookHide == true) {
      this.setData({
        addBookHide: false,
        focus: true
      })
    } else {
      this.setData({
        addBookHide: true
      })
    }
  },
  getBookClassifyValue: function (e) {
    var that = this;
    var value = e.detail.value;
    that.setData({
      addBookClassifyValue: value
    })
  },
  addBookClassify: function () {
    var that = this;
    var addBookClassifyValue = that.data.addBookClassifyValue;
    var value = addBookClassifyValue.replace(/(^\s+)|(\s+$)/g, "");
    var bcList = that.data.bcList;
    var book = {};
    if (value) {
      book = { text: value, path: '../../images/bc-select.png', imgHide: true, banShow: false };
      bcList.push(book);
    }
    that.setData({
      bcList: bcList,
      addBookHide: true,
      addBookClassifyValue: ''
    })
  },
  // 分类---end

  // 借阅条件---begin
  toBorrowBookCondition: function () {
    var that = this;
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateY(600).step()
    that.setData({
      conditionAnimation: animation.export(),
      borrowBookConditionHide: false
    })
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        conditionAnimation: animation.export()
      })
    }, 200)
  },
  scalePickerChange: function (e) {
    this.setData({
      scaleIndex: e.detail.value
    })
  },
  datePickerChange: function (e) {
    this.setData({
      dateIndex: e.detail.value
    })
  },
  // 获取押金值
  depositValue: function (e) {
    var that = this;
    var value = e.detail.value;
    that.setData({
      depositValue: value
    })
  },
  // 获取租金值
  rentValue: function (e) {
    var that = this;
    var value = e.detail.value;
    that.setData({
      rentValue: value
    })
  },
  // 获取最长期限
  maxDateValue: function (e) {
    var that = this;
    var value = e.detail.value;
    that.setData({
      maxDateValue: value
    })
  },
  // 点击确定
  setComplate: function () {
    var that = this;
    var depositValue = that.data.depositValue;
    var rentValue = that.data.rentValue;
    var maxDateValue = that.data.maxDateValue;
    var scaleIndex = that.data.scaleIndex;
    var dateIndex = that.data.dateIndex;
    var scaleList = that.data.scaleList;
    var dateList = that.data.dateList;
    var scaleValue = scaleList[scaleIndex];
    var dateValue = dateList[dateIndex];
    that.setData({
      depositValue: depositValue,
      rentValue: rentValue,
      maxDateValue: maxDateValue,
      scaleIndex: scaleIndex,
      dateIndex: dateIndex,
      scaleValue: scaleValue,
      dateValue: dateValue
    })
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateY(0).step()
    that.setData({
      conditionAnimation: animation.export(),
      borrowBookConditionHide: false
    })
    setTimeout(function () {
      animation.translateY(600).step()
      that.setData({
        conditionAnimation: animation.export()
      })
    }, 200)
  },
  backMyBookDetail: function () {
    var that = this;
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateY(0).step()
    that.setData({
      conditionAnimation: animation.export(),
      borrowBookConditionHide: false
    })
    setTimeout(function () {
      animation.translateY(600).step()
      that.setData({
        conditionAnimation: animation.export()
      })
    }, 200)
  }
  // 借阅条件---end
})