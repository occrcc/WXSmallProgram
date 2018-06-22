var app = getApp();
var network = require('../../../utils/network.js');


Page({
  data: {
    userInfo: null,
    resultid: '',
    myavar: '',
    heavar: '',
    answers: [],
    currentQuestion: {},
    animationData: {},
    chooseSize: false,
    index: 0,
    selectIndex: -1,
    selectAnswer: [], // 所有答案
    QAArr:[],
    scrollTop:0,
    percentage:'',
  },

  onReady: function() {
    this.showActionSheet();
  },

  showActionSheet: function() {
    var that = this;
    that.animation = null;
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateY(500).step()
    that.setData({
      animationData: animation.export(),
      chooseSize: true
    })
    setTimeout(function() {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export()
      })
    }, 200)
  },

  onShow: function() {
    this.loadUserInfo();
  },

  onLoad: function(options) {
    console.log(options.id);
    var activeid = options.id ? options.id : '444';
    this.setData({
      resultid: activeid
    })

    this.getDataById(activeid, (res) => {
      var item = res.data;
      console.log('getData:', item);

      var source = {
        question: item.body.answers[0].title,
        answer : ''
      }
      var arr = [];
      arr.push(source);

      this.setData({
        answers: item.body.answers,
        heavar: item.avar,
        answers: item.body.answers,
        currentQuestion: item.body.answers[0],
        QAArr: arr,
      })
    })

  },

  getDataById: function(id, successcallback) {
    var that = this;
    network.GET({
      params: {},
      url: 'ognz/v2/getActivityEnjoyById/' + id,
      success: function(requestData) {
        if (successcallback) {
          successcallback(requestData)
        }
      },
      fail: function(res) {
        wx.showModal({
          title: '请检查网络连接',
          content: JSON.stringify(error),
          showCancel: false,
        })
      },
    })
  },

  loadUserInfo: function() {
    var that = this;
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        that.setData({
          userInfo: res.data,
          myavar: res.data.avatarUrl,
        })
      },
      fail: function(error) {}
    })
  },


  selectQuestion: function(e) {
    if (this.data.selectIndex >= 0) {
      return;
    }
    var that = this;
    var index = that.data.index;
    index++;

    

    var chooseIndex = parseInt(e.currentTarget.id);
    var cur = this.data.currentQuestion.items[chooseIndex];
    var currentAnswer = this.data.currentQuestion;

    var source = {
      question: currentAnswer.title,
      answer: cur
    }

    var arr = that.data.QAArr;
    arr.push(source);
    arr = arr.filter((item) => {
      return item.answer.length > 0;
    });

    var answer = {
      id: currentAnswer.id,
      title: currentAnswer.title,
      items: currentAnswer.items,
      answer: cur,
    }
    var selectAnswer = this.data.selectAnswer;
    selectAnswer.push(answer);
    this.setData({
      selectAnswer: selectAnswer,
      QAArr: arr,
    });

    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateY(600).step()
    that.setData({
      animationData: animation.export(),
      index: index,
      selectIndex: chooseIndex
    })

    if (index >= 5) {
      console.log('你已经做完5道题了');
      console.log('我答的题:', that.data.selectAnswer);
      console.log('他答的题:', that.data.answers);
      var soult = that.filterData(that.data.selectAnswer, that.data.answers);
      var percentage = (5 - soult.length) * 20;
      console.log('相似度:', percentage+'%');

      

      that.setData({
        chooseSize: false,
        percentage: percentage,
      })
      setTimeout(function() {
        that.pageScrollToBottom();
        that.setData({
          chooseSize: false,
          selectIndex: -1,
        })
      }, 500)

      setTimeout(function () {
        wx.navigateTo({
          url: '../testTacit/testTacit?id=' + that.data.resultid + '&percentage=' + that.data.percentage,
        })
      }, 1200)

      return;
    }

    var currentQuestion = that.data.currentQuestion;
    currentQuestion = that.data.answers[index];
    setTimeout(function() {
      animation.translateY(0).step();
      that.pageScrollToBottom();
      that.setData({
        animationData: animation.export(),
        chooseSize: true,
        currentQuestion: currentQuestion,
        selectIndex: -1,
      })
    }, 500)
  },

  filterData: function(myAnswers, answers) { //循环判断数组a里的元素在b里面有没有，有的话就放入新建立的数组中
    var result = [];
    for (var i = 0; i < answers.length; i++) {
      var obj = answers[i];
      var isExist = false;
      for (var j = 0; j < myAnswers.length; j++) {
        var aj = myAnswers[j];
        if (aj.title == obj.title && aj.answer == obj.answer) {
          isExist = true;
          break;
        }
      }
      if (!isExist) {
        result.push(obj);
      }
    }
    console.log('我答错的题:', result);
    return result;
  },

  pageScrollToBottom: function () {
    var len = this.data.QAArr.length //遍历的数组的长度  
    this.setData({ scrollTop: len * 300});
  },

})