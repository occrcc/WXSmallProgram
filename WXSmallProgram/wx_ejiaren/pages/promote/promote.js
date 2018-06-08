var network = require('../../utils/network.js');
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    fromData: ['', '', '', ''],
    focusId: '',
    inputArr: [
      {
        placeholder: '姓名',
        id: 0,
      },
      {
        placeholder: '电话',
        id: 1,
      },
      {
        placeholder: '邮箱',
        id: 2,
      },
      {
        placeholder: '公司名称',
        id: 3,
      },
    ],
  },


  onLoad: function (options) {
    this.loadUserInfo();
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

  selectItem: function (event) {
  },

  loadUserInfo: function () {
    var self = this;
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
      },
      fail: function (err) {
      }
    })
  },

  realnameConfirm: function (e) {
    console.log(e);
  },

  bindFocus: function (event) {
    var id = event.currentTarget.dataset.id
    console.log(id);
    this.setData({
      focusId: id
    })
  },

  bindKeyInput: function (event) {
    var that = this;
    var value = event.detail.value
    var id = event.currentTarget.dataset.id;
    var fromData = that.data.fromData;
    fromData[id] = value;
    this.setData({
      fromData: fromData
    })
  },

  showAlert: function (i) {
    let message = '';
    switch (i) {
      case 3: message = '公司名称为必填的哦！'; break;
      case 2: message = '请留下您的邮箱吧!'; break;
      case 0: message = '大侠，请留下您的称呼吧！'; break;
      case 1: message = '联系方式不能为空哦！'; break;
      default: message = '您的信息已提交成功，我们会在1-2个工作日与您联系。'; break;
    }
    wx.showModal({
      title: '提示',
      content: message,
      showCancel: false,
    })
  },

  submitData: function () {
    var fromData = this.data.fromData;
    var that = this;
    for (var i = 0; i < fromData.length; i++) {
      let ss = fromData[i];
      if (ss.length < 1) {
        this.showAlert(i);
        return;
      }
    }

    var data = {};
    data.company_name = fromData[3];
    data.position = fromData[2];
    data.contact_name = fromData[0];
    data.contact_phone = fromData[1];
    network.POST(
      {
        params: data,
        url: 'company/enroll',
        success: function (res) {
          that.showAlert(i);
        },
        fail: function (res) {
          console.log('请求失败:  ', res)
          that.setData({
            hidden: true
          })
        },
      })
  },

})