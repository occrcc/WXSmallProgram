
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
    allData:{},
    openId:'',
    showIndex:1,

    loading:true,
  },

  onShow: function () {
    this.loadUserInfo();
    this.getUserOpenId();
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
    if (index<=4){
      index++;
      var showIndex = this.data.showIndex;
      showIndex++;
      this.setData({ index: index, selectIndex: chooseIndex });
      var answer = {
        id: currentAnswer.id,
        title: currentAnswer.title,
        items: currentAnswer.items,
        answer: cur,
      }
      var selectAnswer = this.data.selectAnswer;
      selectAnswer.push(answer);
      this.setData({ selectAnswer: selectAnswer, });
    }

    if (this.data.index >= 5){
      console.log('你已经做完5道题了');
      this.submitAnswers();
      return;
    }
    var that = this;
    setTimeout(function () {
      var quest = that.data.selectQuestion[index];
      that.setData({
        selectIndex: -1,
        currentQuestion: quest,
        showIndex: showIndex,
      })
    }, 500);
  },

  pickQuestion: function (e) {

    console.log('换一换', e.detail.formId);
    app.postFormID(this.data.openId, e.detail.formId);

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
          question: questions,
          allData:res,
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
          currentQuestion: sequestion[0],
          loading:false
        })
        console.log('当前问题', this.data.currentQuestion);
      }
    })
  },

  submitAnswers:function(){

    console.log(this.data.selectAnswer);
    var that = this;
    var nick = this.data.userInfo.nickName;
    nick = that.filteremoji(nick);
    var sendData = {
      activityid: this.data.allData.id,
      nickname: nick,
      avar: this.data.userInfo.avatarUrl,
      openId: that.data.openId,
      body: {
        answers: this.data.selectAnswer,
      }
    }
    console.log('sendData', sendData);
    network.POST({
      params: sendData,
      header: { 'content-type': 'application/json' },
      url: 'ognz/v2/activityEnjoy',
      success: function (res) {
        if (res.data.result) {
          console.log('请求成功：',res.data);
          wx.redirectTo({
            url: '../answerResults/answerResults?id=' + res.data.t.result.id,
          })
        } else {
          that.showAlert();
        }
      },
      fail: function (err) {
        console.log('请求失败:  ', err)
        that.setData({ selectIndex: -1 })
        that.showAlert();
      },
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
  },

  filteremoji: function (emojireg) {
    var ranges = [
      '\ud83c[\udf00-\udfff]',
      '\ud83d[\udc00-\ude4f]',
      '\ud83d[\ude80-\udeff]'
    ];
    emojireg = emojireg.replace(new RegExp(ranges.join('|'), 'g'), '');
    return emojireg;
  },

  loadUserInfo: function () {
    var that = this;
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        that.setData({
          userInfo: res.data,
        })
      },
      fail: function (error) {
      }
    })
  },

  getUserOpenId: function () {
    var self = this
    if (app.globalData.openId) {
      self.setData({ openId: app.globalData.openId });
    } else {
      wx.login({
        success: function (data) {
          console.log(data);
          network.GET(
            {
              params: {},
              url: 'wxmppay/jscode2session?appid=' + app.globalData.app_id + '&secret=' + app.globalData.app_secret + '&js_code=' + data.code,
              success: function (res) {
                app.globalData.openId = res.data.openid;
                self.setData({ openId: res.data.openid });
              },
              fail: function (res) {
              },
            })
        },
        fail: function (err) {
          console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
          callback(false, err)
        }
      })
    }
  },
  
  showAlert: function () {
    wx.showToast({
      title: '网络错误',
      icon: 'loading',  //图标，支持"success"、"loading"  
      image: '../../../images/icon-error.png',  //自定义图标的本地路径，image 的优先级高于 icon  
      duration: 2000, //提示的延迟时间，单位毫秒，默认：1500  
      mask: true,  //是否显示透明蒙层，防止触摸穿透，默认：false  
      success: function () { }, //接口调用成功的回调函数  
      fail: function () { },  //接口调用失败的回调函数  
      complete: function () { } //接口调用结束的回调函数  
    })
  },
  



})