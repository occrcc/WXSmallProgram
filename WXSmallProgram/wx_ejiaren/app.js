
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

    ognz_id: '292',
    app_id: 'wx228149285d62ecbd',
    app_secret: 'e5e909f4b4afdf81522dd56fdaa2aec4',
    ognz_name:'思铺学术',


    openId:'',
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