
var network = require('../../utils/network.js');
var app = getApp();


Page({
  data: {
    itemArr: [],
    loadingHidden: false,
    total: 1,
    index: 1,
    size: 6,
    searchLoadingComplete:false,
  },

  onShow: function () {
    this.makeRequest();
  },

  hideNavigationBar: function () {
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },

  //下拉刷新
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.setData({
      index: 1,
      searchLoadingComplete: false,
    }, () => {
      this.makeRequest();
    })
  },

  onLoad: function (options) {
  },

  /**
   * 获取列表数据 并根据id进行排序。
   */
  makeRequest: function (isLoadMore) {
    var params = new Object()
    var that = this;
    network.GET(
      {
        params: params,
        url: 'ognz/v2/ognzActivityListPaged?ognzId=' + app.globalData.ognz_id + '&templateId=2&status=1&index=' + that.data.index + '&size=' + that.data.size,
        success: function (res) {
          that.hideNavigationBar();
          that.setData({
            total: res.data.total,
          });
          
          var oldData = res.data.list.filter((item) => {
            return item.status == 1;
          });
          //按objeid进行排序
          var dataArr = oldData.sort((a, b) => {
            console.log(a.id < b.id ? 1 : 0);
            return a.id < b.id ? 1 : -1
          });

          if (isLoadMore) {
            var moreD = that.data.itemArr;
            moreD = moreD.concat(dataArr);
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
              itemArr: dataArr,
              loadingHidden: true,
            });
          }
        },
        fail: function (res) {
          // that.hideNavigationBar();
        },
      })
  },

  /**
   * 点击操作
   */
  selectItem: function (event) {
    let index = parseInt(event.currentTarget.id);
    var item = this.data.itemArr[index];
    wx.navigateTo({
      url: '../signInput/signInput?id=' + item.id
    })
  },


  /** 
   * 页面上拉触底事件的处理函数 
   */
  loadMore: function () {
    var index = this.data.index;
    index++;
    this.setData({ index: index }, () => {
      this.makeRequest(true);
    });
  }
})