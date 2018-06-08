
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    options:null,
  },

  onLoad: function (options){
    console.log(options);
    this.setData({options:options});
  },

  bindGetUserInfo: function (e) {
    var options = this.data.options;
    var pageUrl = '';
    if (options.page == 'invitation') {
      pageUrl = '../invitation/invitation?invitation=' + options.invitation + '&sharid=' + options.sharid + '&data=' + options.data;
    } else if (options.page == 'index'){
      pageUrl = '../index/index?'
    } else if (options.page == 'homeDetails') {
      pageUrl = '../homeDetails/homeDetails?item=' + options.item + '&sharHomeDetailData=' + options.sharHomeDetailData ;
    } else if (options.page == 'signinput') {
      pageUrl = '../signInput/signInput?id=' + options.id;
    } else if (options.page == 'zzContent') {
      pageUrl = '../zouzhe/zzContent/zzContent?id=' + options.id;
    }


    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      wx.setStorage({
        key: 'userInfo',
        data: e.detail.userInfo,
      })
      wx.redirectTo({
        url: pageUrl,
      })
    } else {
      //用户按了拒绝按钮
      console.log('拒绝使用')
    }
  }

})