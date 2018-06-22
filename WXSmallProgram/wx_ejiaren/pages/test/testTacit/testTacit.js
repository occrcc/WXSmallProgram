var app = getApp();
var network = require('../../../utils/network.js');


Page({
  data: {
    userInfo: null,
    myavar: '',
    heavar: '',
    topItem:[
      { image: '../../../images/test_first.png', avarUrl:'../../../images/test_first.png',nikeName:'桐轩'},
      { image: '../../../images/test_first.png', avarUrl: '../../../images/test_first.png', nikeName: '桐轩' },
      { image: '../../../images/test_first.png', avarUrl: '../../../images/test_first.png', nikeName: '桐轩' },
      { image: '../../../images/test_first.png', avarUrl: '../../../images/test_first.png', nikeName: '桐轩' },
      { image: '../../../images/test_first.png', avarUrl: '../../../images/test_first.png', nikeName: '桐轩' },
    ]
  },

  onShow: function() {
    this.loadUserInfo();
  },

  onLoad: function(options) {
    console.log(options.id);
    var activeid = options.id ? options.id : '444';
    this.setData({
      resultid: activeid
    })

    this.getDataById(activeid, (res) => {
      var item = res.data;
      console.log('getData:', item);
      this.setData({
        heavar: item.avar,
      })
    })
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

  showAnswer:function(e){
    console.log('查看答案', e.detail.formId);
  },
  player: function (e) {
    console.log('我也要玩', e.detail.formId);
  },

})