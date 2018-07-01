
var app = getApp();
var network = require('../../../utils/network.js');
const util = require('../../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    allData: {},
    selectId: -1,
    ognz_name: '',
    selectItem: {},
    hideName: '',
    shareData: {},
    saveImageUrl: '',
    baseImgUrl: '',
    baseTipViewShow: false,
    loadingHidden: true,
    haiBaoName: '',
    hidden: true,
    ognzIcon: '',
    openId: '',
    hidden1:true,
  },

  onShareAppMessage: function () {
    return this.data.shareData
  },


  onLoad: function (options) {
    var that = this;
    that.setData({ ognzIcon: 'http://pic.ejiarens.com/wx/ognz_' + app.globalData.ognz_id + '.png' })
    var name = app.globalData.ognz_name;
    that.getUserOpenId((result, res) => {
    });
    that.getDataById(options.id, (res) => {
      var item = res.data;
      console.log(item);
      that.setData({
        allData: item,
        ognz_name: name,
        shareData: {
          title: '[有人@你]冲冠只差一步，一起来参加世界杯竞猜吧！',
          imageUrl: '../../../images/sjb_shar.jpg',
          path: '/pages/sjb/sjbHome/sjb_home?id=' + options.id,
        }
      })
      this.tongji(true);
    });
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

  sharActivity: function (event) {
    let formId = event.detail.formId;
    console.log('formId:' + formId);
  },

  selectItem: function (event) {
    let index = parseInt(event.currentTarget.id);
    console.log('index:' + index + ',selectId:' + this.data.selectId)
    var items = this.data.allData.body.teams[index];
    let formId = event.detail.formId;
    console.log(items.name + ' : ' + formId);
    this.setData({ selectId: index, selectItem: items, haiBaoName: items.name })
  },

  showSureBtn: function () {
    console.log(this.data.selectId);
    this.loadUserInfo((res) => {
      if (!res) {
        this.setData({
          hidden1: false
        });
      } else {
        if (this.data.selectId >= 0) {
          console.log(this.data.haiBaoName);
          this.submitData();
          this.getHaibao();
        } 
      }
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



  showDetails: function () {
    console.log('查看详情');
    this.setData({
      hidden: false
    });

  },

  confirm1: function () {
    this.setData({
      hidden: true
    });
  },

  saveImage: function () {
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
    setTimeout(function () {
      that.setData({
        baseTipViewShow: false,
      })
    }, 2000)
  },


  submitData: function () {
    console.log(this.data.userInfo);
    var that = this;
    var nick = this.data.userInfo.nickName;
    nick = that.filteremoji(nick);
    var sendData = {
      activityid: this.data.allData.id,
      nickname: nick,
      avar: this.data.userInfo.avatarUrl,
      openId: that.data.openId,
      body: {
        selectTeam: this.data.selectItem.name,
      }
    }
    console.log('sendData', sendData);
    network.POST({
      params: sendData,
      header: { 'content-type': 'application/json' },
      url: 'ognz/v2/activityEnjoy',
      success: function (res) {
        if (res.data.result) {
          var item = res.data.t.activity;
          var itmeName = that.data.selectItem.name;
          that.setData({ allData: item, hideName: '', });
        } else {

        }
      },
      fail: function (err) {
        console.log('请求失败:  ', err)
      },
    })
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

  tongji: function (isonLoad) {
    var id = this.data.allData.id;
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
    that.setData({ loadingHidden: false });

    let saveImageUrl = that.data.saveImageUrl;
    let baseImgUrl = that.data.baseImgUrl;
    if (saveImageUrl.length > 1 && baseImgUrl.length > 1) {
      that.setData({ loadingHidden: true }, () => {
        that.showHaibao();
      });
    }
    var userInfo = this.data.userInfo;
    var nickname = userInfo.nickName;
    nickname = this.filteremoji(nickname);
    if (nickname.length > 10) {
      nickname = nickname.slice(0, 9);
    }
    var date = util.formatDate(new Date());
    date = date.replace(/-/g, '.');

    var ognzName = '来自' + app.globalData.ognz_name;
    if (ognzName.length > 29) {
      ognzName = ognzName.slice(0, 28);
    }
    console.log('haiBaoName: ', this.data.haiBaoName);
    var codeUrl = "https://wxapi.ejiarens.com/wxmppay/createQcode?appid=" + app.globalData.app_id + "&secret=" + app.globalData.app_secret + "&path=" + encodeURI('pages/sjb/sjbHome/sjb_home?id=' + this.data.allData.id);
    var sendInfo = {};
    sendInfo = {
      "backgroundUrl": "http://pic.ejiarens.com/wx/sjb_haibao_" + this.data.haiBaoName + '.png',
      "height": 1334,
      "width": 750,
      "drawInfos": [{
        "point": {
          "lineHeight": 0,
          "height": 0,
          "width": 369,
          "y": 172,
          "x": 560 + (10 - nickname.length) * 8
        },
        "fontInfo": {
          "fontName": "MicrosoftYaHei",
          "fontColor": {
            "g": 175,
            "b": 125,
            "r": 206,
          },
          "fontMetrics": 1,
          "fontSize": 14
        },
        "drawType": "text",
        "info": nickname
      },
      {
        "point": {
          "lineHeight": 0,
          "height": 0,
          "width": 369,
          "y": 197,
          "x": 600,
        },
        "fontInfo": {
          "fontName": "MicrosoftYaHei",
          "fontColor": {
            "g": 175,
            "b": 125,
            "r": 206,
          },
          "fontMetrics": 1,
          "fontSize": 12
        },
        "drawType": "text",
        "info": date
      },
      {
        "point": {
          "lineHeight": 0,
          "height": 0,
          "width": 730,
          "y": 1300,
          "x": 10 + (29 - ognzName.length) * 13,
        },
        "fontInfo": {
          "fontName": "MicrosoftYaHei",
          "fontColor": {
            "g": 175,
            "b": 125,
            "r": 206,
          },
          "fontMetrics": 1,
          "fontSize": 24
        },
        "drawType": "text",
        "info": ognzName
      },
      {
        "point": {
          "lineHeight": 0,
          "height": 104,
          "width": 104,
          "y": 1100,
          "x": 395
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
      }],
    }
    console.log(sendInfo.backgroundUrl);


    network.POST(
      {
        params: sendInfo,
        header: { 'content-type': 'application/json' },
        url: 'third/buildPoster',
        success: function (res1) {
          console.log('请求成功：', res1.data);
          var downUrl = res1.data.t;
          downUrl = downUrl.replace('http://pic.ejiarens.com', 'https://wxpic.ejiarens.com');
          wx.downloadFile({
            url: downUrl,
            success: function (res) {
              that.setData({
                saveImageUrl: res.tempFilePath,
                baseImgUrl: downUrl,
                loadingHidden: true,
              }, () => {
                that.showHaibao();
              })
            },
            fail: function (err) {
              that.setData({ loadingHidden: true });
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

  getUserOpenId: function (callback) {
    var self = this
    if (app.globalData.openId) {
      self.setData({ openId: app.globalData.openId });
      callback(true, app.globalData.openId)
    } else {
      wx.login({
        success: function (data) {
          console.log(data);
          network.GET(
            {
              params: {},
              url: 'wxmppay/jscode2session?appid=' + app.globalData.app_id + '&secret=' + app.globalData.app_secret + '&js_code=' + data.code,
              success: function (res) {
                app.globalData.openId = res.data.openid;
                self.setData({ openId: res.data.openid });
                callback(true, res.data.openid);
              },
              fail: function (res) {
              },
            })
        },
        fail: function (err) {
          console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
          callback(false, err)
        }
      })
    }
  },

  cancel: function () {
    this.setData({
      hidden1: true
    });
  },

  confirm: function () {
    this.setData({
      hidden1: true
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
      if (this.data.selectId >= 0) {
        console.log(this.data.haiBaoName);
        this.submitData();
        this.getHaibao();
      } 

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

})