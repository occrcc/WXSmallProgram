
var network = require('../../utils/network.js');
const openIdUrl = require('../../config').openIdUrl;

var app = getApp();

Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    listImgUrls: [
      'http://pic.ejiarens.com/wx/sjb_list.jpg',
      'http://pic.ejiarens.com/wx/home_list1.png',
      'http://pic.ejiarens.com/wx/home_list2.png',
      'http://pic.ejiarens.com/wx/home_list3.png',
      
      'http://pic.ejiarens.com/wx/home_list99.png'],
    isOk: false,
    netWork: true,
    selectSJBUrl: '',
  },



  onLoad: function (options) {
    var ognz_name = '';
    switch (app.globalData.ognz_id) {
      case '275': ognz_name = '逸家人'; break;
      case '290': ognz_name = '独课教育'; break;
      case '288': ognz_name = '艾芯留学'; break;
      case '163': ognz_name = '威久留学'; break;
      case '292': ognz_name = '思铺学术'; break;
    }
    app.globalData.ognz_name = ognz_name;

    this.getUserOpenId((res) => {
      console.log(res);
    });

    this.makeRequest(res => {
      if (res) {
        let navUrl = '../sjb/sjbHome/sjb_home?id=' + res.id;
        console.log(navUrl);
        this.setData({ selectSJBUrl: navUrl });
      }
    })

    let q = options.sharid;
    var that = this;
    if (parseInt(q) > 0) {
      network.GET({
        params: {},
        url: 'ognz/getActivityShareUserById/' + q,
        success: function (requestData) {
          var getitem = requestData.data;
          getitem.nickName = getitem.result.nickName;
          getitem.avatarUrl = getitem.result.avar;
          wx.navigateTo({
            url: '../invitation/invitation?invitation=true&data=' + JSON.stringify(getitem)
          })
        },
        fail: function (res) {
          wx.showModal({
            title: '请检查网络连接',
            content: JSON.stringify(error),
            showCancel: false,
          })
        },
      })
    }

    setTimeout(function () {
      if (options.data && that.data.netWork) {
        wx.navigateTo({
          url: '../invitation/invitation?invitation=true&data=' + options.data,
        })
      } else if (options.sharHomeDetailData && that.data.netWork) {
        wx.navigateTo({
          url: '../homeDetails/homeDetails?sharHomeDetailData=' + options.sharHomeDetailData,
        })
      }
    }, 1000);
  },

  onShow: function () {
    this.loadUserInfo();
  },

  loadUserInfo: function (item) {
    var self = this;
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        console.log("loadUser: ", res.data);
        self.setData({ isOk: true })
      },
      fail: function (err) {
        console.log("loadUserError: ", err);
        wx.redirectTo({
          url: '../authorization/authorization?page=index',
        })
      }
    })
  },

  showAlert: function () {
    wx.showToast({
      title: '暂未开放',
      icon: 'loading',  //图标，支持"success"、"loading"  
      image: '../../images/icon-error.png',  //自定义图标的本地路径，image 的优先级高于 icon  
      duration: 1000, //提示的延迟时间，单位毫秒，默认：1500  
      mask: true,  //是否显示透明蒙层，防止触摸穿透，默认：false  
      success: function () { }, //接口调用成功的回调函数  
      fail: function () { },  //接口调用失败的回调函数  
      complete: function () { } //接口调用结束的回调函数  
    })
  },

  selectItem: function (event) {
    if (!this.data.isOk) {
      wx.redirectTo({
        url: '../authorization/authorization?page=index',
      })
      return;
    }

    let index = parseInt(event.currentTarget.id);
    let navUrl = '';
    switch (index) {
      case (1): navUrl = '../signUp/signUp'; break;
      case (2): navUrl = '../home/home'; break;
      case (3): navUrl = '../zouzhe/zzList/zzList'; break;
      case (0): {
        if (this.data.selectSJBUrl.length > 0) {
          navUrl = this.data.selectSJBUrl;
        } else this.showAlert();
      }; break;
      default: navUrl = ''; break;
    }
    if (navUrl.length > 0) {
      wx.navigateTo({
        url: navUrl
      })
    }
  },


  getUserOpenId: function (callback) {
    var self = this
    if (app.globalData.openId) {
      callback(null, app.globalData.openId)
    } else {
      wx.login({
        success: function (data) {
          console.log(data);
          network.GET(
            {
              params: {},
              url: 'wxmppay/jscode2session?appid=' + app.globalData.app_id + '&secret=' + app.globalData.app_secret + '&js_code=' + data.code,
              success: function (res) {
                console.log (res);
                app.globalData.openId = res.data.openid;
              },
              fail: function (res) {
              },
            })
        },
        fail: function (err) {
          console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
          callback(err)
        }
      })
    }
  },

  makeRequest: function (successcallback) {
    var that = this;
    network.GET(
      {
        params: {},
        url: 'ognz/v2/ognzActivityListPaged?ognzId=' + app.globalData.ognz_id + '&templateId=4',
        success: function (res) {
          if (res.data.total >= 0) {
            successcallback(res.data.list[0]);
          } else successcallback(null);
        },
        fail: function (res) {
        },
      })
  },


})