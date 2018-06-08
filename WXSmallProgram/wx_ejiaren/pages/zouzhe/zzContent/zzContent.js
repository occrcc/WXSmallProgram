var network = require('../../../utils/network.js');
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    item: {},
    baseTipViewShow: false,
    baseImgUrl: '',
    userInfo: null,
    saveImageUrl: '',
    shareData: {},
  },

  onShareAppMessage: function () {
    return this.data.shareData
  },


  onLoad: function (options) {
    this.loadUserInfo((res) => {
      if (options.id) {
        this.getDataById(options.id, (res) => {
          var item = res.data;
          this.setData({
            item: item,
            shareData: {
              title: '【有人@我】臣有紧要秘本上奏，请皇上快快批阅',
              imageUrl: '../../../images/zz_share.jpg',
              path: '/pages/zouzhe/zzContent/zzContent?id=' + item.id,
            }
          });
          this.tongji(true);
          this.getHaibao();
        })
      }
    });
  },

  getDataById: function (id, successcallback) {
    var that = this;
    network.GET({
      params: {},
      url: 'ognz/v2/getOgnzActivityById/' + id,
      success: function (requestData) {
        if (successcallback) {
          successcallback(requestData)
        }
      },
      fail: function (res) {
        wx.showModal({
          title: '请检查网络连接',
          content: JSON.stringify(error),
          showCancel: false,
        })
      },
    })
  },

  onReady: function () {
    if (!this.data.userInfo) {
      wx.redirectTo({
        url: '../../authorization/authorization?page=zzContent&id=' + this.data.item.id,
      })
    }
  },

  showAlert: function (message) {
    wx.showModal({
      title: '提示',
      content: message,
      showCancel: false,
      confirmText: '知道了',
      success: function (res) { }
    })
  },

  loadUserInfo: function (backres) {
    var that = this;
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        console.log("loadUsers1: ", res.data);
        that.setData({
          userInfo: res.data,
        })
        backres(res.data);
      },
    })
  },

  showHaibao: function () {
    this.setData({
      baseTipViewShow: true,
    })
  },

  selectBaseImage: function () {
    this.setData({
      baseTipViewShow: false,
    })
  },

  tongji: function (isonLoad) {
    var id = this.data.item.id;
    var field = isonLoad ? 'enjoyPeople' : 'sharePeople';
    network.GET({
      params: {},
      url: 'ognz/addupActivityV2Count?id=' + id + '&field=' + field,
      success: function (res) {
        console.log('统计成功：', res.data);
      },
      fail: function (res) {
        wx.showModal({
          title: '请检查网络连接',
          content: JSON.stringify(error),
          showCancel: false,
        })
      },
    })
  },

  getHaibao: function () {
    var that = this;
    let saveImageUrl = that.data.saveImageUrl;
    let baseImgUrl = that.data.baseImgUrl;
    if (saveImageUrl.length > 1 && baseImgUrl.length > 1) {
      return;
    }
    var userInfo = this.data.userInfo;
    var teacher = this.data.teacherInfo;
    var sendInfo = {};
    sendInfo.avarImg = userInfo.avatarUrl;
    sendInfo.nickname = this.filteremoji(userInfo.nickName + '');
    sendInfo.text = "朕给爱卿的八百里加急密旨,还不赶紧长按扫码接旨";
    sendInfo.title = that.data.item.title;
    sendInfo.appid = app.globalData.app_id;
    sendInfo.secret = app.globalData.app_secret;
    sendInfo.path = 'pages/zouzhe/zzContent/zzContent?id=' + that.data.item.id;
    console.log('sendInfo:', sendInfo);
    network.POST(
      {
        params: sendInfo,
        url: 'third/drawPosterV2',
        success: function (res1) {
          var downUrl = res1.data.t;
          downUrl = downUrl.replace('http://pic.ejiarens.com', 'https://wxpic.ejiarens.com');
          console.log('downUrl:', downUrl);
          wx.downloadFile({
            url: downUrl,
            success: function (res) {
              that.setData({
                saveImageUrl: res.tempFilePath,
                baseImgUrl: res1.data.t,
              })
            },
            fail: function (err) {
              wx.showModal({
                title: 'error',
                content: JSON.stringify(err)
              })
            },
          })
        },
        fail: function (err) {
          console.log('请求失败:  ', err)
        },
      })
  },

  filteremoji: function (emojireg) {
    var ranges = [
      '\ud83c[\udf00-\udfff]',
      '\ud83d[\udc00-\ude4f]',
      '\ud83d[\ude80-\udeff]'
    ];
    emojireg = emojireg.replace(new RegExp(ranges.join('|'), 'g'), '');
    return emojireg;
  },

  saveImage: function () {
    var that = this;
    console.log('saveImageUrl', that.data.saveImageUrl);
    wx.saveImageToPhotosAlbum({
      filePath: that.data.saveImageUrl,
      success: (res1) => {
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
    setTimeout(function () {
      that.setData({
        baseTipViewShow: false,
      })
    }, 2000)
  },

})