
var network = require('../../utils/network.js');
const openIdUrl = require('../../config').openIdUrl;
var app = getApp();
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    listImgUrls: [
      'http://pic.ejiarens.com/wx/home_list1.png', 
      'http://pic.ejiarens.com/wx/home_list2.png',
      'http://pic.ejiarens.com/wx/home_list3.png', 
      'http://pic.ejiarens.com/wx/sjb_list.jpg', 
      'http://pic.ejiarens.com/wx/home_list99.png'],
    isOk: false,
    netWork: true,
  },


  onLoad: function (options) {

    this.getUserOpenId((res)=>{
      console.log(res);
    });

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
      case (0): navUrl = '../signUp/signUp'; break;
      case (1): navUrl = '../home/home'; break;
      case (2): navUrl = '../zouzhe/zzList/zzList'; break;
      case (3):{
        navUrl = '';
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
      };break;
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
    if (app.globalData.openid) {
      callback(null, self.globalData.openid)
    } else {
      wx.login({
        success: function (data) {
          console.log(data.code);
          // wx.request({
          //   url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appId + '&secret=' + secret + '&js_code=' + code,
          //   data: {
          //     code: data.code
          //   },
          //   success: function (res) {
          //     console.log('拉取openid成功', res)
          //     app.globalData.openid = res.data.openid
          //     callback(null, self.globalData.openid)
          //   },
          //   fail: function (res) {
          //     console.log('拉取用户openid失败，将无法正常使用开放接口等服务', res)
          //     callback(res)
          //   }
          // })
        },
        fail: function (err) {
          console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
          callback(err)
        }
      })
    }
  }


})