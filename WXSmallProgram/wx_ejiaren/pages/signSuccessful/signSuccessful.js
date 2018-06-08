var network = require('../../utils/network.js');

var app = getApp();
Page({
  data: {
    captchaImage: '',
    shareData: {},
    loadingHidden: false,
    imgurl: null,
  },

  onShow: function () {
  },

  onShareAppMessage: function () {
    return this.data.shareData
  },

  onLoad: function (options) {
    if (options.id) {
      this.getQrCode(options.id);
      this.setData({
        shareData: {
          title: options.title,
          imageUrl: '../../images/hd_share.png',
          path: '/pages/signInput/signInput?id=' + options.id,
        }
      })
    }
  },

  getQrCode: function (itemId) {
    var that = this;
    var downUrl = '';
    downUrl = "https://wxapi.ejiarens.com/wxmppay/createQcode?appid=" + app.globalData.app_id + "&secret=" + app.globalData.app_secret + "&path="  + encodeURI('pages/signInput/signInput?id=' + itemId);

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

  saveCode: function () {
    var that = this;
    console.log('saveImageUrl', that.data.captchaImage);
    wx.saveImageToPhotosAlbum({
      filePath: that.data.captchaImage,
      success: (res) => {
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail: (err) => {
        wx.showModal({
          title: 'error',
          content: JSON.stringify(err) + that.data.saveImageUrl
        })
      }
    })
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
  }
})
