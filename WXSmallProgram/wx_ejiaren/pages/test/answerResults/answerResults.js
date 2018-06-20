
var app = getApp();
var network = require('../../../utils/network.js');


Page({
  data: {
    ognzIcon: '',
    userInfo: null,
    captchaImage:'',
  },

  onShow: function () {
    this.setData({
      ognzIcon: 'http://pic.ejiarens.com/wx/ognz_' + app.globalData.ognz_id + '.png'
    })
  },

  onLoad: function () {
    this.loadUserInfo(res=>{
      this.getQrCode(90);
      this.setData({
        ognzIcon: res.avatarUrl,
      })
    })
  },


  loadUserInfo: function (backres) {
    var that = this;
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        that.setData({
          userInfo: res.data,
        })
        if (backres) backres(res.data);
      },
      fail: function (error) {
        backres(null);
      }
    })
  },
  
  getQrCode: function (itemId) {
    var that = this;
    var downUrl = '';
    downUrl = "https://wxapi.ejiarens.com/wxmppay/createQcode?appid=" + app.globalData.app_id + "&secret=" + app.globalData.app_secret + "&path=" + encodeURI('pages/signInput/signInput?id=' + itemId);

    console.log(downUrl);

    wx.downloadFile({
      url: downUrl,
      success: function (res) {
        console.log(res);
        that.createNewImg(res.tempFilePath);
      },
      fail: function (err) {
        wx.showModal({
          title: 'error',
          content: JSON.stringify(err)
        })
      }
    })
  },

  createNewImg: function (path) {
    let that = this;
    let ctx = wx.createCanvasContext('my_Canvas');
    ctx.drawImage(path, 0, 0, 140, 140);
    ctx.draw();
    setTimeout(function () {
      that.savePic();
    }, 400);
  },

  savePic: function () {
    let that = this;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 170,
      height: 170,
      canvasId: 'my_Canvas',
      success: function (res) {
        console.log('tempFilePath:', res.tempFilePath)
        that.setData({ captchaImage: res.tempFilePath, loadingHidden: true })
      }
    })
  },
  
 

})