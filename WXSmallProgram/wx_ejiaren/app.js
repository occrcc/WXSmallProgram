
const openIdUrl = require('./config').openIdUrl
var network = require('./utils/network.js');
const updateManager = wx.getUpdateManager()
//app.js
App({
  onLaunch: function () {
    console.log('App Launch')
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log('是否有新版本：', res.hasUpdate);
      if (res.hasUpdate) {
        updateManager.onUpdateReady(function () {
          updateManager.applyUpdate()
        })
        updateManager.onUpdateFailed(function () {
          console.log('新的版本下载失败');
        })
      }
    })
  },

  onHide: function () {
    console.log('App Hide')
  },

  globalData: {
    isIphoneX: false,
    userInfo: null,
    hasLogin: false,
    ognz_id: '275',
    app_id: 'wxdcd3e1f2d5c97b8f',
    app_secret: 'a0d4fc5d1b7d8195086fa0c4c46e5954',
    ognz_name:'逸家人科技',
    openId:'',
  },

  postFormID: function (openId, fromId) {
    var that = this;
    if (!openId || !fromId) return;
    var senderInfo = {
      openId: openId + '',
      fromId: fromId + '',
      ognzId: parseInt(that.globalData.ognz_id),
    }
    console.log('senderInfo', senderInfo);
    network.POST({
      params: senderInfo,
      header: { 'content-type': 'application/json' },
      url: 'wxmp/saveFormId',
      success: function (res) {
        console.log('saveFormId', res.data);
      },
      fail: function (res) {
      },
    })
  },

  onShow: function () {
    let that = this;
    wx.getSystemInfo({
      success: res => {
        // console.log('手机信息res'+res.model)  
        let modelmes = res.model;
        if (modelmes.search('iPhone X') != -1) {
          that.globalData.isIphoneX = true
        }
      }
    })
  },
})