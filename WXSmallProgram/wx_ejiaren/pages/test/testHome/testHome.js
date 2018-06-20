
var app = getApp();
var network = require('../../../utils/network.js');
var shipAnimation = null;
var titleAnimation = null;
var startTitleAnimation = null;

Page({
  data: {
    animationData: {},
    titleAnimationData: {},
    startTitleAnimationData: {},
    shipUrl: '',
    hidden: true,
    ognzIcon: '',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo:null,
    activice:true,
  },

  onReady: function () {
    var animation = wx.createAnimation({
      duration: 3000,
      timingFunction: 'ease',
    })
    titleAnimation = animation
    animation.opacity(0).step({ duration: 1 }).opacity(1).step();

    // animation.rotate(360).scale(1.8).step({ duration: 1000 }).scale(0.8).step().scale(1).step({ duration: 300 })
    // this.setData({ titleAnimationData: animation.export() })

    // animation.opacity(0).step().opacity(1).scale(1.2, 1.2).step().scale(1, 1).step({ duration: 300 }).scale(1.1, 1.1).step({ duration: 200 }).scale(0.9, 0.9).step({ duration: 100 }).scale(1, 1).step({ duration: 100 })
    this.setData({
      titleAnimationData: animation.export()
    })

    //--------------------------------------------------------------------



    var animation1 = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease-in',
    })
    startTitleAnimation = animation1
    animation1.rotate(5).step()
    this.setData({
      startTitleAnimationData: animation1.export()
    })
    var n = true;
    setInterval(function () {
      n = !n;
      if (n) {
        animation1.rotate(-10).step()
      } else animation1.rotate(10).step()
      this.setData({
        startTitleAnimationData: startTitleAnimation.export()
      })
    }.bind(this), 500)
  },

  onShow: function () {
  
    var animation = wx.createAnimation({
      duration: 5000,
      timingFunction: 'linear',
    })
    shipAnimation = animation
    animation.translateY(8).step()
    this.setData({
      animationData: animation.export(),
      shipUrl: 'http://pic.ejiarens.com/wx/test_ship_' + app.globalData.ognz_id + '.png',
      ognzIcon: 'http://pic.ejiarens.com/wx/ognz_' + app.globalData.ognz_id + '.png'
    })
    var n = true;
    setInterval(function () {
      n = !n;
      if (n) {
        animation.translateY(16).step()
      } else animation.translateY(-16).step()
      this.setData({
        animationData: shipAnimation.export()
      })
    }.bind(this), 2500)
  },

  tousu: function (e) {
    console.log('投诉', e.detail.formId);
    wx.navigateTo({
      url: '../testGuize/testGuize'
    })
  },

  guize: function (e) {
    console.log('规则', e.detail.formId);
    wx.showModal({
      showCancel: false,
      title: '玩法规则',
      content: '从题库中随机选择5道题，并勾选出最适合自己的答案，出完后分享给好友作答。看好友是否能够选择到正确的选项，测试你和好友间的默契值。',
    })
  },

  showResults: function (e) {
    console.log('查看结果', e.detail.formId);
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

  startBtn: function (e) {
    console.log('开始测试', e.detail.formId);
    if (!this.data.activice){
      this.showAlert();
      return;
    }

    this.loadUserInfo((res) => {
      if (!res) {
        this.setData({
          hidden: false
        });
      }else {
        console.log('获取到用户信息', this.data.userInfo);
        this.pushContent();
      }
    })
  },


  cancel: function () {
    this.setData({
      hidden: true
    });
  },

  confirm: function () {
    this.setData({
      hidden: true
    });
  },

  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      wx.setStorage({
        key: 'userInfo',
        data: e.detail.userInfo,
      })

      this.setData({
        userInfo: e.detail.userInfo,
      });

      console.log('授权成功', e.detail.userInfo);
      this.pushContent();

    } else {
      //用户按了拒绝按钮
      console.log('拒绝使用')
    }
  },

  loadUserInfo: function (backres) {
    var that = this;
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        that.setData({
          userInfo: res.data,
        })
        backres(res.data);
      },
      fail: function (error) {
        backres(null);
      }
    })
  },

  pushContent:function(){
    wx.navigateTo({
      url: '../testContent/testContent',
    })
  },

  makeRequest: function (successcallback) {
    var that = this;
    network.GET({
        params: {},
        url: 'ognz/v2/ognzActivityListPaged?ognzId=' + app.globalData.ognz_id + '&templateId=5',
        success: function (res) {
          if (res.data.total > 0) {
            that.setData({
              activice: true,
            })
          } else {
            that.setData({
              activice: false,
            })
          }
        },
        fail: function (res) {
        },
      })
  },

  onLoad: function () {
    this.makeRequest();
  },

})