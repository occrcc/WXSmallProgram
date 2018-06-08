var network = require('../../../utils/network.js');
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    itemArr: [],
    oldItemArr: [],
    total: 1,
    index: 1,
    size: 6,
    searchLoadingComplete: false,
  },

  onLoad: function (options) {
    this.loadUserInfo();
    this.makeRequest();
  },

  makeRequest: function (isLoadMore) {
    var params = new Object()
    var that = this;
    network.GET(
      {
        params: params,
        url: 'ognz/v2/ognzActivityListPaged?ognzId=' + app.globalData.ognz_id + '&templateId=3&status=1&index=' + that.data.index + '&size=' + that.data.size,
        success: function (res) {
          that.setData({
            total: res.data.total / 2,
          });

          var oldData = res.data.list.filter((item) => {
            return item.status == 1;
          });
          var data = oldData.sort((a, b) => {
            console.log(a.id < b.id ? 1 : 0);
            return a.id < b.id ? 1 : -1
          });
          var result = [];
          //数组分割
          for (var i = 0, len = data.length; i < len; i += 2) {
            result.push({
              sectionData: data.slice(i, i + 2),
            }
            );
          }

          if (isLoadMore) {
            var moreD = that.data.itemArr;
            moreD = moreD.concat(result);
            if (moreD.length >= that.data.total) {
              that.setData({
                searchLoadingComplete: true,
              });
            }
            that.setData({
              itemArr: moreD,
              loadingHidden: true,
            });
          } else {
            that.setData({
              itemArr: result,
              loadingHidden: true,
            });
          }
          that.setData({ oldItemArr: data });
        },
        fail: function (res) {
        },
      })
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
    let index = parseInt(event.currentTarget.dataset.index);
    var item = this.filterReplyInfo(this.data.oldItemArr, index);
    wx.navigateTo({
      url: '../zzPiyue/zzPiyue?item=' + JSON.stringify(item[0]),
    })
  },

  //过滤
  filterReplyInfo: function (arr, id) {
    return arr.filter((item) => {
      return item.id == id
    })
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

  jumpNext: function () {
    wx.navigateTo({
      url: '../zzPiyue/zzPiyue'
    })
  },

  scrollToTop: function () {
    return;
    // this.setData({
    //   index: 1,
    //   searchLoadingComplete: false,
    // }, () => {
    //   this.makeRequest();
    // })
  },

  scrollToBottom: function () {
    return;
  },

  loadMore: function () {
    var index = this.data.index;
    index++;
    this.setData({ index: index }, () => {
      this.makeRequest(true);
    });
  },
})