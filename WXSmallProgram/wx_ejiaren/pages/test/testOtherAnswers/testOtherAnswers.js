var app = getApp();
var network = require('../../../utils/network.js');


Page({
  data: {
    userInfo: null,
    myanswer: [],
    question: [],
    guide: ['1、', '2、', '3、', '4、', '5、', '6、', '7、'],
    indexA: ['A、', 'B、', 'C、', 'D、', 'E、', 'F、', 'G、'],
  },

  onShow: function() {},


  onLoad: function(options) {
    console.log(options.id);
    var source = JSON.parse(options.source);
    console.log('source', source);
    var that = this;
    network.GET({
      params: {},
      url: 'ognz/v2/getMyResponse?objId=' + source.objId + '&openId=' + source.openId + '&activityId=' + source.activityid,
      success: function(res) {
        console.log('所有问题：', res.data);
        var myAnswer = res.data.myanswer.myAnswer;
        var answers = res.data.question.answers;

        for (var i = 0, len = answers.length; i < len; i++) {
          var obj = answers[i];
          var obj1 = myAnswer[i];
          obj.myAnswer = obj1.answer;
          console.log('测试一下', obj);
        }
        that.setData({
          myanswer: myAnswer,
          question: answers,
        })
      },
      fail: function(res) {},
    })
  },
})