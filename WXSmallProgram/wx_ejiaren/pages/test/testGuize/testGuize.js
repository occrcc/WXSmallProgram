
var app = getApp();
var network = require('../../../utils/network.js');


Page({
  data: {
    showCheckArr: ['色情', '骚扰', '欺诈', '传播谣言', '诱导', '内容不符', '恶意搜集信息', '侵权'],
    source:''
  },

  checkboxChange: function (event) {
 
    var checkArr = event.detail.value;
    var sourceArr = this.data.showCheckArr;
    var itmeArr = [];
    for (var i = 0; i < checkArr.length; i++) {
      let index = parseInt(checkArr[i]);
      itmeArr.push(sourceArr[index]);
    }
    var source = itmeArr.join(',');
    console.log(source);
    this.setData({ source: source });
  },

  tousu:function(e){
    if (this.data.source.length < 1) {
      this.showAlert();
      return;
    } 
    console.log('投诉', this.data.source,e.detail.formId);
    wx.showToast({
      title: '提交成功',
      duration: 2000,
      success: function () {
        setTimeout(function () {
          wx.navigateBack({})
        }, 2000) 
      }
    })
  },

  showAlert: function () {
    wx.showToast({
      title: '投诉内容不能为空',
      icon: 'loading',  //图标，支持"success"、"loading"  
      image: '../../../images/icon-error.png',  //自定义图标的本地路径，image 的优先级高于 icon  
      duration: 1000, //提示的延迟时间，单位毫秒，默认：1500  
      mask: true,  //是否显示透明蒙层，防止触摸穿透，默认：false  
      success: function () { }, //接口调用成功的回调函数  
      fail: function () { },  //接口调用失败的回调函数  
      complete: function () { } //接口调用结束的回调函数  
    })
  },

})