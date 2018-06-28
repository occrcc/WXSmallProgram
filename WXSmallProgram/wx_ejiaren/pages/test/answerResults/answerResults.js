var app = getApp();
var network = require('../../../utils/network.js');


Page({
  data: {
    ognzIcon: '',
    userInfo: null,
    captchaImage: '',
    resultid: '',
    baseTipViewShow: false,
    saveImageUrl: '',
    baseImgUrl: '',
    loadingHidden: true,
    haiBaoName: '',
    openId: '',
    shareData: {},
    
  },

  onShareAppMessage: function () {
    return this.data.shareData
  },

  onLoad: function(options) {
    this.getUserOpenId((result, res) => {});
    this.setData({
      resultid: options.id
    })
    this.loadUserInfo(res => {
      this.getQrCode(options.id);
      this.getHaibao();
      console.log(res);
      this.setData({
        ognzIcon: res.avatarUrl,
        shareData: {
          title: res.nickName + '@你来进行友情默契测试',
          imageUrl: 'http://pic.ejiarens.com/wx/test_shar.png',
          path: '/pages/test/testQuestions/testQuestions?id=' + options.id,
        }
      })
    })
  },

  loadUserInfo: function(backres) {
    var that = this;
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        that.setData({
          userInfo: res.data,
        })
        if (backres) backres(res.data);
      },
      fail: function(error) {
        backres(null);
      }
    })
  },

  getQrCode: function(itemId) {
    var that = this;
    var downUrl = '';
    downUrl = "https://wxapi.ejiarens.com/wxmppay/createQcode?appid=" + app.globalData.app_id + "&secret=" + app.globalData.app_secret + "&is_hyaline=true" + "&path=" + encodeURI('pages/test/testQuestions/testQuestions?id=' + itemId);
    wx.downloadFile({
      url: downUrl,
      success: function(res) {
        that.createNewImg(res.tempFilePath);
      },
      fail: function(err) {
        wx.showModal({
          title: 'error',
          content: JSON.stringify(err)
        })
      }
    })
  },

  createNewImg: function(path) {
    let that = this;
    let ctx = wx.createCanvasContext('my_Canvas');
    ctx.drawImage(path, 0, 0, 140, 140);
    ctx.draw();
    setTimeout(function() {
      that.savePic();
    }, 400);
  },

  savePic: function() {
    let that = this;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 170,
      height: 170,
      canvasId: 'my_Canvas',
      success: function(res) {
        console.log('tempFilePath:', res.tempFilePath)
        that.setData({
          captchaImage: res.tempFilePath,
          loadingHidden: true
        })
      }
    })
  },


  getHaibao: function() {
    var that = this;
    that.setData({
      loadingHidden: false
    });

    let saveImageUrl = that.data.saveImageUrl;
    let baseImgUrl = that.data.baseImgUrl;
    if (saveImageUrl.length > 1 && baseImgUrl.length > 1) {
      return;
    }
    var userInfo = this.data.userInfo;
    var avatarUrl = userInfo.avatarUrl;
    var codeUrl = "https://wxapi.ejiarens.com/wxmppay/createQcode?appid=" + app.globalData.app_id + "&secret=" + app.globalData.app_secret +'&is_hyaline=true'+ "&path=" + encodeURI('pages/test/testQuestions/testQuestions?id=' + that.data.resultid);
    var sendInfo = {};
    sendInfo = {
      "backgroundUrl": "http://pic.ejiarens.com/wx/test_haibao.png",
      "height": 1334,
      "width": 750,
      "drawInfos": [
        { 
          "point": {
            "lineHeight": 0,
            "height": 100,
            "width": 100,
            "y": 50,
            "x": 30
          },
          "fontInfo": {
            "fontName": "MicrosoftYaHei",
            "fontColor": {
              "g": 219,
              "b": 87,
              "r": 254
            },
            "fontMetrics": 1,
            "fontSize": 40
          },
          "drawType": "cirleimage",
          "info": avatarUrl
        },
        {
          "point": {
            "lineHeight": 0,
            "height": 248,
            "width": 248,
            "y": 574,
            "x": 251
          },
          "fontInfo": {
            "fontName": "MicrosoftYaHei",
            "fontColor": {
              "g": 52,
              "b": 52,
              "r": 52
            },
            "fontMetrics": 1,
            "fontSize": 40
          },
          "drawType": "image",
          "info": codeUrl
        }
      ],
    }

    console.log('sendInfo', JSON.stringify(sendInfo))

    network.POST({
      params: sendInfo,
      header: {
        'content-type': 'application/json'
      },
      url: 'third/buildPoster',
      success: function(res1) {
        console.log('请求成功：', res1.data);
        var downUrl = res1.data.t;
        downUrl = downUrl.replace('http://pic.ejiarens.com', 'https://wxpic.ejiarens.com');
        wx.downloadFile({
          url: downUrl,
          success: function(res) {
            that.setData({
              saveImageUrl: res.tempFilePath,
              baseImgUrl: downUrl,
              loadingHidden: true,
            }, () => {
              // that.showHaibao();
            })
          },
          fail: function(err) {
            that.setData({
              loadingHidden: true
            });
            wx.showModal({
              title: 'error',
              content: JSON.stringify(err)
            })
          },
        })
      },
      fail: function(err) {
        console.log('请求失败:  ', err)
      },
    })
  },

  filteremoji: function(emojireg) {
    var ranges = [
      '\ud83c[\udf00-\udfff]',
      '\ud83d[\udc00-\ude4f]',
      '\ud83d[\ude80-\udeff]'
    ];
    emojireg = emojireg.replace(new RegExp(ranges.join('|'), 'g'), '');
    return emojireg;
  },

  saveImage: function() {
    var that = this;
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
    setTimeout(function() {
      that.setData({
        baseTipViewShow: false,
      })
    }, 2000)
  },


  showHaibao: function(e) {
    console.log('保存海报', e.detail.formId);
    app.postFormID(this.data.openId, e.detail.formId)
    this.saveImage();
    // this.setData({
    //   baseTipViewShow: true,
    // })
  },
  selectBaseImage: function() {
    // this.setData({
    //   baseTipViewShow: false,
    // })
  },



  getUserOpenId: function(callback) {
    var self = this
    if (app.globalData.openId) {
      self.setData({
        openId: app.globalData.openId
      });
      callback(true, app.globalData.openId)
    } else {
      wx.login({
        success: function(data) {
          console.log(data);
          network.GET({
            params: {},
            url: 'wxmppay/jscode2session?appid=' + app.globalData.app_id + '&secret=' + app.globalData.app_secret + '&js_code=' + data.code,
            success: function(res) {
              app.globalData.openId = res.data.openid;
              self.setData({
                openId: res.data.openid
              });
              callback(true, res.data.openid);
            },
            fail: function(res) {},
          })
        },
        fail: function(err) {
          console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
          callback(false, err)
        }
      })
    }
  },

  sharData:function(e){
    console.log('保存海报', e.detail.formId);
    app.postFormID(this.data.openId, e.detail.formId)
  },

  tongji: function (isonLoad) {
    var id = this.data.resultid;
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




})