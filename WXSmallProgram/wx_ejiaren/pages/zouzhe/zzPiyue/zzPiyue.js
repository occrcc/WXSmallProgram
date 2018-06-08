

Page({
  /**
   * 页面的初始数据
   */
  data: {
    item:null,
  },

  onLoad: function (options) {
    var item = JSON.parse(options.item);
    this.setData({ item: item});
  },

  piyue: function () {
    wx.navigateTo({
      url: '../zzContent/zzContent?id=' + JSON.stringify(this.data.item.id),
    })
  }

})