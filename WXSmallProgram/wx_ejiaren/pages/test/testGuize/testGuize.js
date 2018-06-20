
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
    console.log('投诉', e.detail.formId);
  },

})