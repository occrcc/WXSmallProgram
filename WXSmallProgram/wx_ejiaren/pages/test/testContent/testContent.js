
var app = getApp();
var network = require('../../../utils/network.js');


Page({
  data: {
    ognzIcon: '',
    userInfo: null,
    selectQuestion:[], //一共五道题
    question: [],      // 所有问题
    currentQuestion:{}, // 当前页面显示的问题
    index:0,            // 当前第几题
    selectAnswer: [],   // 所有答案
    selectIndex:-1,
    answerLetter: ['A、', 'B、', 'C、', 'D、', 'E、','F、'],
    pickHide:false,
  },

  onShow: function () {
    this.setData({
      ognzIcon: 'http://pic.ejiarens.com/wx/ognz_' + app.globalData.ognz_id + '.png'
    })
  },

  next: function (e) {
    if (this.data.selectIndex >= 0) {
      return;
    }

    console.log(e.currentTarget.id + ' : ' + e.target.dataset.id);
    var chooseIndex = parseInt(e.currentTarget.id);
    var cur = this.data.currentQuestion.items[chooseIndex];
    var currentAnswer = this.data.currentQuestion;
    var index = this.data.index;
    index ++;
    this.setData({ index: index, selectIndex: chooseIndex});
    var answer = {
      id: currentAnswer.id,
      title: currentAnswer.title,
      items: currentAnswer.items,
      answer: cur,
    }
    var selectAnswer = this.data.selectAnswer;
    selectAnswer.push(answer);
    this.setData({ selectAnswer: selectAnswer, });

    if (this.data.index >= 5){
      console.log('你已经做完5道题了');
      this.setData({pickHide:true})
      this.submitAnswers();
      return;
    }
    var that = this;
    setTimeout(function () {
      var quest = that.data.selectQuestion[index];
      that.setData({
        selectIndex: -1,
        currentQuestion: quest,
      })
    }, 500);
  },

  pickQuestion: function (e) {
    this.setData({ selectIndex: -1});
    console.log(e.target.dataset.id);
    var indexItemId = e.target.dataset.id;
    var cur = this.data.selectQuestion.find(v=>{
      return v.id == indexItemId;
    });

    if (cur.spec) {
      var q = this.data.question.filter(v => v.spec && v.id != cur.id);
      q = this.shuffleArray(q);
      var selectQuestion = this.data.selectQuestion;
      selectQuestion.splice(this.data.index, 1, q[0]);
      this.setData({ selectQuestion: selectQuestion, currentQuestion:q[0]})
    }else {
      var q = this.data.question.filter(v => {
        if (!v.spec) {
          var exits = false;
          this.data.selectAnswer.map(j => {
            if (j.id == v.id) {
              exits = true;
            }
          })
          if (!exits) {
            return v;
          }
        }
      });
      q = this.shuffleArray(q);
      var selectQuestion = this.data.selectQuestion;
      selectQuestion.splice(this.data.index, 1, q[0]);
      this.setData({ selectQuestion: selectQuestion, currentQuestion: q[0] })
    }
  },

  onLoad: function () {
    //读取body.question
    var that = this;
    this.makeRequest(res => {
      if (res) {
        var questions = res.body.question;
        this.setData({
          question: questions
        })
        var sequestion = [];
        var selectQuestion = questions.filter(v => !v.spec);
        selectQuestion = that.shuffleArray(selectQuestion);
        sequestion = selectQuestion.slice(0, 4);

        var selectQuestion1 = questions.filter(v => v.spec);
        console.log('必选题:',selectQuestion1);
        selectQuestion1 = that.shuffleArray(selectQuestion1);
        sequestion.push(selectQuestion1[0]);

        this.setData({
          selectQuestion: sequestion,
          currentQuestion: sequestion[0]
        })
        console.log('当前问题', this.data.currentQuestion);
      }
    })
  },

  submitAnswers:function(){
    console.log(this.data.selectAnswer);
    wx.redirectTo({
      url: '../answerResults/answerResults',
    })
  },
  makeRequest: function (successcallback) {
    var that = this;
    network.GET(
      {
        params: {},
        url: 'ognz/v2/ognzActivityListPaged?ognzId=' + app.globalData.ognz_id + '&templateId=5',
        success: function (res) {
          if (res.data.total > 0) {
            successcallback(res.data.list[0]);
          } else successcallback(null);
        },
        fail: function (res) {
        },
      })
  },

  shuffleArray: function (array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }


})