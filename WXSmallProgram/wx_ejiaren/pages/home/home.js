var network = require('../../utils/network.js');
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    itemArr: [],
    showGujia: true,
    gujiaImgUrl: '../../images/gujia.png',
    netWork: true,
    total: 1,
    index: 1,
    size: 6,
    searchLoadingComplete: false,
    hidden: true,
    itemId: '',
    userInfo:null,
    item:{},
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

  makeRequest: function (isLoadMore) {
    var params = new Object()
    var that = this;
    network.GET(
      {
        params: params,
        url: 'ognz/v2/ognzActivityListPaged?ognzId=' + app.globalData.ognz_id + '&templateId=1&status=1&index=' + that.data.index + '&size=' + that.data.size,
        success: function (res) {
          that.hideNavigationBar();
          that.setData({
            total: res.data.total,
          });

          var newItemArr = [];
          for (var i = 0; i < res.data.list.length; i++) {
            let item = res.data.list[i];
            if (parseInt(item.status) == 1) {
              var dateSpan, tempDate, iDays;
              var date = new Date();
              date.setTime(item.createTime);
              var y = date.getFullYear();
              var m = date.getMonth() + 1;
              m = m < 10 ? ('0' + m) : m;
              var d = date.getDate();
              d = d < 10 ? ('0' + d) : d;
              var nowDate = y + "-" + m + "-" + d;
              var new_date = new Date();
              var sDate1 = Date.parse(nowDate);
              var sDate2 = new_date.getTime();
              dateSpan = sDate2 - sDate1;
              dateSpan = Math.abs(dateSpan);
              iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
              item.timer = iDays + 'd';

              if (item.body.teacherThumb.length < 1) {
                item.body.teacherThumb = '../../images/01.png'
              }
              if (!item.body.teacherPosition || item.body.teacherPosition.length < 1) {
                item.body.teacherPosition = '\n'
              }
              item.select_id = i + '';
              item.headImg = '../../images/headImg' + (i % 3) + '.png';
              newItemArr.push(item);
            }
          }

          if (isLoadMore) {
            var moreD = that.data.itemArr;
            moreD = moreD.concat(newItemArr);
            console.log(newItemArr.length)
            if (moreD.length >= that.data.total) {
              that.setData({
                searchLoadingComplete: true,
              });
            }
            that.setData({
              itemArr: moreD,
              loadingHidden: true,
              showGujia: false,
              netWork: true,
            });
          } else {
            that.setData({
              itemArr: newItemArr,
              loadingHidden: true,
              showGujia: false,
              netWork: true,
            });
          }
          wx.setStorage({
            key: 'homeData',
            data: newItemArr,
          })
        },
        fail: function (res) {
          that.hideNavigationBar();
          that.setData({
            showGujia: false,
            netWork: false,
          });

          wx.getStorage({
            key: 'homeData',
            success: function (res) {
              that.setData({
                itemArr: res.data,
                showGujia: false,
              });
            },
            fail: function (err) {
              that.setData({
                showGujia: true,
                gujiaImgUrl: '../../images/networkError.png'
              });
            }
          })
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
    let index = parseInt(event.currentTarget.id);
    var item = JSON.stringify(this.data.itemArr[index]);
    this.setData({item:item});
    this.loadUserInfo((res) => {
      if (!res) {
        this.setData({
          hidden: false
        });
      } else {
        wx.navigateTo({
          url: '../homeDetails/homeDetails?item=' + item
        })
      }
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
      wx.navigateTo({
        url: '../homeDetails/homeDetails?item=' + this.data.item
      })

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