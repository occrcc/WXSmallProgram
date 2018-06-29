var app = getApp();
var network = require('../../../utils/network.js');


Page({
  data: {
    userInfo: null,
    topList:[],
    openId:'',
    loadingHidden:true,
    isHideBack:true,
  },

  onShow: function() {
    this.loadUserInfo();
  },

  onLoad: function(options) {
    var that = this;
    console.log(options.id);

    that.setData({ loadingHidden: false, isHideBack: options.isHideBack})

    this.getUserOpenId((result, res) => { 
      if (!result) return;
      console.log(res);
      network.GET({
        params: {},
        url: 'ognz/v2/listActivityEnrollEnjoyByActivityIdAndObjId?activityId=' + options.id + '&openId=' + res,
        success: function (requestData) {
          console.log('requestData', requestData.data);
          var data = requestData.data;
          for (var i = 0, len = data.length; i < len; i++) {
            var obj = data[i];
            if (obj.nickname.length > 6) {
              obj.nickname = obj.nickname.slice(0,6) + '...' ;
            }
          }
          that.setData({ topList: requestData.data, loadingHidden: true });
        },
        fail: function (res) {
          wx.showModal({
            title: '请检查网络连接',
            content: JSON.stringify(error),
            showCancel: false,
          })
        },
      })
    });
  },

  getMyTop:function(openId){
    var that = this;
    network.GET({
      params: {},
      url: 'ognz/v2/listActivityEnrollEnjoyByActivityIdAndObjId?activityId=' + res.activityid + '&openId=' + res.openId,
      success: function (requestData) {
        console.log('requestData', requestData.data);
        that.setData({ topList: requestData.data});
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

  
  loadUserInfo: function() {
    var that = this;
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        that.setData({
          userInfo: res.data,
          myavar: res.data.avatarUrl,
        })
      },
      fail: function(error) {}
    })
  },

  getUserOpenId: function (callback) {
    var self = this
    if (app.globalData.openId) {
      self.setData({
        openId: app.globalData.openId
      });
      callback(true, app.globalData.openId)
    } else {
      wx.login({
        success: function (data) {
          console.log(data);
          network.GET({
            params: {},
            url: 'wxmppay/jscode2session?appid=' + app.globalData.app_id + '&secret=' + app.globalData.app_secret + '&js_code=' + data.code,
            success: function (res) {
              app.globalData.openId = res.data.openid;
              self.setData({
                openId: res.data.openid
              });
              callback(true, res.data.openid);
            },
            fail: function (err) {
              callback(false, err)
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

  backHome:function(){
    wx.redirectTo({
      url: '../testHome/testHome',
    })
  },
  

})