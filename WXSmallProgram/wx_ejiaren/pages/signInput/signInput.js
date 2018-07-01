
var network = require('../../utils/network.js');
var WxParse = require('../wxParse/wxParse.js');
var utils = require('../../utils/util.js');
var app = getApp();

Page({
  data: {
    dataItem: {},
    inputTypes: [],
    showCheck: false,
    showCheckArr: [],
    selectCurrent: 0,
    toView: '',
    userInfo: null,
    currentDate: '1978-01-01',
    loadingHidden: true,
    showHd:true,
    peopleArr:null,
    shareData: {},
    isIphoneX: app.globalData.isIphoneX,
    userInfo: null,
    hidden: true,
    optionId:'',
  },

  onShareAppMessage: function () {
    return this.data.shareData
  },


  onShow: function () {
    var time = utils.formatDate(new Date());
    this.setData({ currentDate: time });
  },

  loadAllData: function (optionId){
    optionId = optionId ? optionId : this.data.optionId;
    this.getDataById(optionId, (res) => {
      var item = res.data;
      this.setData({
        shareData: {
          title: item.title,
          imageUrl: '../../images/hd_share.jpg',
          path: '/pages/signInput/signInput?id=' + optionId,
        }
      })

      console.log('loadAllData', this.data.shareData);

      var types = item.body.submitSheetFields;
      if (item.body.activitytime.length < 1 && item.body.activityaddress.length < 1 && item.body.tel.length < 1) {
        this.setData({ showHd: false });
      }
      this.setData({ dataItem: item, inputTypes: types });
      WxParse.wxParse('article', 'html', item.info, this, 5);
    });
    this.getActivityid(optionId, (res) => {
      let resd = res.data;
      if (resd.length > 0) {
        this.setData({ peopleArr: resd });
      }
    });
  },

  onLoad: function (options) {
    this.setData({ optionId: options.id})
    this.loadUserInfo((res) => {
      if (!res) {
        this.setData({
          hidden: false
        });
      } else {
        if (options.id) {
          this.loadAllData(options.id);
        }
      }
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

  getActivityid: function (id, successcallback) {
    var that = this;
    network.GET({
      params: {},
      url: 'ognz/listactivityenroll/' + id,
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


  submitData: function () {
    var self = this;
    var subData = this.data.inputTypes.map(v => {
      return {
        field: v.displayName,
        value: v.value ? v.value : null,
      };
    })
    var i = 0;
    for (var inputItme in subData) {
      var subItme = subData[i];
      if (!subItme.value) {
        this.showAlert(subItme.field + '不能为空');
        return;
      }
      i++;
    }

    var sendData = {
      activityid: this.data.dataItem.id,
      nickname: this.data.userInfo.nickName,
      avar: this.data.userInfo.avatarUrl,
      body: {}
    }
    subData.map(v => {
      sendData.body[v.field] = v.value;
    })
    self.setData({ loadingHidden: false, });
    network.POST({
      params: sendData,
      header: { 'content-type': 'application/json' },
      url: 'ognz/v2/activityEnroll',
      success: function (res) {
        console.log(res);
        self.setData({ loadingHidden: true }, () => {
          wx.navigateTo({
            url: '../signSuccessful/signSuccessful?id=' + self.data.dataItem.id + '&title=' + self.data.dataItem.title
          })
        });
      },
      fail: function (err) {
        console.log('请求失败:  ', err)
      },
    })
  },

  showAlert: function (message) {
    wx.showModal({
      title: '',
      content: message,
      showCancel: false,
    })
  },

  showCheckBox: function (event) {
    let index = parseInt(event.currentTarget.id);
    let item = this.data.inputTypes[index];
    this.setData({ showCheck: true, showCheckArr: item.dicts, selectCurrent: index });
  },

  dataInput: function (event) {
    var itemType = this.data.inputTypes;
    let index = parseInt(event.currentTarget.id);
    let item = this.data.inputTypes[index];
    item.value = event.detail.value;
    itemType[index] = item;
    this.setData({ inputTypes: itemType });
  },

  bindDateChange: function (event) {
    var self = this;
    let index = parseInt(event.currentTarget.id);
    let item = this.data.inputTypes[index];
    var itemType = this.data.inputTypes;
    item.value = event.detail.value;
    itemType[index] = item;
    console.log(itemType);
    self.setData({ inputTypes: itemType });
  },

  listenerRadioGroup: function (event) {
    var itemType = this.data.inputTypes;
    let index = parseInt(event.currentTarget.id);
    let item = this.data.inputTypes[index];

    item.value = event.detail.value;
    item.name = event.detail.value;
    item.checked = true;
    itemType[index] = item;
    console.log(itemType);
    this.setData({ inputTypes: itemType });
  },

  showActionSheet: function (event) {
    var self = this;
    let index = parseInt(event.currentTarget.id);
    let item = this.data.inputTypes[index];
    var itemType = this.data.inputTypes;
    wx.showActionSheet({
      itemList: item.dicts,
      success: function (res) {
        if (!res.cancel) {
          console.log(item.dicts[res.tapIndex]);
          item.value = item.dicts[res.tapIndex];
          itemType[index] = item;
          self.setData({ inputTypes: itemType });
        }
      }
    })
  },

  cancelBtn: function () {
    this.setData({ showCheck: false })
  },

  sureBtn: function () {
    this.setData({ showCheck: false })
  },

  checkboxChange: function (event) {
    var itemType = this.data.inputTypes;
    let item = this.data.inputTypes[this.data.selectCurrent];
    let dicts = item.dicts;
    var checkArr = event.detail.value;
    var itmeArr = [];
    for (var i = 0; i < checkArr.length; i++) {
      let index = parseInt(checkArr[i]);
      itmeArr.push(dicts[index]);
    }
    item.value = itmeArr.join(',');
    itemType[this.data.selectCurrent] = item;
    this.setData({ inputTypes: itemType });
  },

  scrollToView: function () {
    this.setData({ toView: 'toView' })
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

  cancel: function () {
    this.setData({
      hidden: true
    });
  },

  confirm: function () {
    this.setData({
      hidden: true
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
      this.loadAllData();

    } else {
      //用户按了拒绝按钮
      console.log('拒绝使用')
    }
  },

})