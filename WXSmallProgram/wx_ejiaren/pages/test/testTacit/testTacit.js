var app = getApp();
var network = require('../../../utils/network.js');


Page({
  data: {
    userInfo: null,
    myavar: '',
    heavar: '',
    percentage: 0,
    animationData: {},
    topList: [],
    chooseSize: false,
    henickname: '',
    openId: '',
    hidden:false,
    source:null,
  },

  onShow: function() {
    this.loadUserInfo((res) => {
      if (!res) {
        this.setData({
          hidden: false
        })
      }
    })
    this.getUserOpenId((result, res) => {});
  },

  onLoad: function(options) {
    
    console.log(options.id);
    var activeid = options.id ? options.id : '444';
    var percentage = parseInt(options.percentage);
    percentage = percentage >= 100 ? 100 : percentage;
    var tips = '';
    switch (percentage) {
      case (0):
        tips = '友谊的小船儿已经翻了~~';
        break;
      case (20):
        tips = '你伤害了我~还一笑而过';
        break;
      case (40):
        tips = '走点心 我觉得我们还能抢救下！';
        break;
      case (60):
        tips = '你能不能把我们纯洁的革命友谊,再升华一下？';
        break;
      case (80):
        tips = '这结果我只能给82分 剩下的666了~';
        break;
      default:
        tips = '妥妥的真爱老铁！';
        break;
    }

    this.setData({
      resultid: activeid,
      percentage: percentage,
      tips: tips,
      source : options.source,
    })

    this.getDataById(activeid, (res) => {
      var item = res.data;
      console.log('getData:', item);
      this.getTop10List(res.data);
      this.setData({
        heavar: item.avar,
        henickname: item.nickname
      })
    });
    this.showPipei();
  },

  getTop10List: function(res) {
    var that = this;
    network.GET({
      params: {},
      url: 'ognz/v2/listActivityEnrollEnjoyByActivityIdAndObjId?activityId=' + res.activityid + '&openId=' + res.openId,
      success: function(requestData) {
        console.log('requestData', requestData.data);
        that.setData({
          topList: requestData.data
        });
      },
      fail: function(res) {
        wx.showModal({
          title: '请检查网络连接',
          content: JSON.stringify(error),
          showCancel: false,
        })
      },
    })
  },

  showPipei: function() {
    var that = this;
    var percentage = parseInt(this.data.percentage);
    if (percentage == 0) {
      percentage = 285
    } else if (percentage >= 100) {
      percentage = 0;
    } else {
      percentage = 285 - percentage * 2.85;
    }
    var animation = wx.createAnimation({
      duration: 600,
      timingFunction: 'linear'
    })
    that.animation = animation;
    animation.translateX(-285).step()
    that.setData({
      animationData: animation.export(),
      chooseSize: true
    })
    setTimeout(function() {
      animation.translateX(-percentage).step()
      that.setData({
        animationData: animation.export()
      })
    }, 200)
  },

  getDataById: function(id, successcallback) {
    var that = this;
    network.GET({
      params: {},
      url: 'ognz/v2/getActivityEnjoyById/' + id,
      success: function(requestData) {
        if (successcallback) {
          successcallback(requestData)
        }
      },
      fail: function(res) {
        wx.showModal({
          title: '请检查网络连接',
          content: JSON.stringify(error),
          showCancel: false,
        })
      },
    })
  },

  loadUserInfo: function(backres) {
    var that = this;
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        that.setData({
          userInfo: res.data,
          myavar: res.data.avatarUrl,
        })
        backres(res.data);
      },
      fail: function(res) {
        backres(null);
      }
    })
  },

  showAnswer: function(e) {
    app.postFormID(this.data.openId, e.detail.formId);
    console.log('查看答案', e.detail.formId);
    wx.navigateTo({
      url: '../testOtherAnswers/testOtherAnswers?source=' + this.data.source,
    })
  },

  player: function(e) {
    console.log('我也要玩', e.detail.formId);
    app.postFormID(this.data.openId, e.detail.formId);
    wx.redirectTo({
      url: '../testHome/testHome',
    })
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

})