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
    nickname:'',
    openId:'',
    answerLetter: ['A、', 'B、', 'C、', 'D、', 'E、', 'F、'],
    showIndex: 1,
    hidden:true,
    activityid:'',
    objId:'',
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

  onLoad: function(options) {
    this.getUserOpenId((result, res) => { });
    var activeid = options.id ? options.id : '444';
    this.setData({
      resultid: activeid
    })
    this.loadUserInfo((res) => {
      if (!res) {
        this.setData({
          hidden: false
        })
      }else {
        this.requestData();
      }
    })
  },

  requestData: function (){
    var activeid = this.data.resultid;
    this.getDataById(activeid, (res) => {
      var item = res.data;
      console.log('getData:', item);
      var source = {
        question: '1/5  ' + item.body.answers[0].title,
        answer: '',
        nickname: item.nickname,
      }
      var arr = [];
      arr.push(source);
      this.setData({
        heavar: item.avar,
        answers: item.body.answers,
        currentQuestion: item.body.answers[0],
        QAArr: arr,
        activityid: item.activityid,
        objId: item.openId,
      })
      this.showActionSheet();
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

  
  loadUserInfo: function (backres) {
    var that = this;
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        that.setData({
          userInfo: res.data,
          myavar: res.data.avatarUrl,
        })
        backres(res.data);
      },
      fail: function (res) {
        backres(null);
      }
    })
  },


  selectQuestion: function(e) {
    console.log('chooseIndex');
    if (this.data.selectIndex >= 0) {
      return;
    }
    
    var that = this;
    var index = that.data.index;
    if (index<5){
     console.log('index:'+index);
      var showIndex = that.data.showIndex;
     
        index++;
        showIndex++;
      
     
      var chooseIndex = parseInt(e.currentTarget.id);
      console.log('chooseIndex', chooseIndex);
      var cur = this.data.currentQuestion.items[chooseIndex];
      var currentAnswer = this.data.currentQuestion;
      console.log(currentAnswer)
      var arr = that.data.QAArr;
      var obj = arr[arr.length - 1];
      obj.answer = cur;
      console.log('1212312312', arr);

      // arr = arr.filter((item) => {
      //   return item.answer.length > 0;
      // });

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

      if (index<5){
        console.log('animationindex:' + index);
        var animation = wx.createAnimation({
          duration: 500,
          timingFunction: 'linear'
        })
        that.animation = animation
        animation.translateY(600).step()
        
        that.setData({
          animationData: animation.export(),
          index: index,
          chooseSize: true,
          selectIndex: chooseIndex
        })
      }

    }
    
    if (index >= 5) {
      var soult = that.filterData(that.data.selectAnswer, that.data.answers);
      var percentage = (5 - soult.length) * 20;
      console.log('相似度:', percentage + '%');
      that.setData({
        //chooseSize: true,
        percentage: percentage,
      })
      that.submitData((requestData, sendSo)=>{
        console.log('你已经做完5道题了');
        console.log('我答的题:', that.data.selectAnswer);
        console.log('他答的题:', that.data.answers);
        that.setData({
          chooseSize: false,
        })
        var animation = wx.createAnimation({
          duration: 500,
          timingFunction: 'linear'
        })
        that.animation = animation
        animation.translateY(600).step()
        that.setData({
          animationData: animation.export(),
          index: index,
          chooseSize: false,
          selectIndex: chooseIndex
        })
        
        setTimeout(function () {
          that.pageScrollToBottom();
          that.setData({
            chooseSize: false,
            selectIndex: -1,
          })
          console.log('requestData.data',requestData.data);
          if (requestData.data.result) {
            wx.redirectTo({
              url: '../testTacit/testTacit?id=' + that.data.resultid + '&percentage=' + that.data.percentage + '&source=' + sendSo,
            })
          }
        }, 500)
      });
      return;
    }

    var currentQuestion = that.data.currentQuestion;
    currentQuestion = that.data.answers[index];

    var source = {
      question: showIndex +'/5  ' + currentQuestion.title,
      answer: ''
    }
    arr.push(source);
    setTimeout(function() {
      animation.translateY(0).step();
      that.setData({
        animationData: animation.export(),
        chooseSize: true,
        currentQuestion: currentQuestion,
        selectIndex: -1,
        QAArr: arr,
        showIndex: showIndex,
      })
      that.pageScrollToBottom();
    }, 500)
  },

  submitData:function(rev){
    var that = this;
    var sendData = {
      nickname: that.data.userInfo.nickName,
      avar: that.data.userInfo.avatarUrl,
      id: parseInt(that.data.resultid),
      score: parseInt(that.data.percentage),
      body : {
        myAnswer: that.data.selectAnswer,
      },
      openId: that.data.openId,
    }
    console.log(sendData);
    console.log('我答的题:', that.data.selectAnswer);
    console.log('他答的题:', that.data.answers);
    var nextData = {
      activityid: that.data.activityid,
      objId : that.data.objId,
      openId : that.data.openId,
    }
    var sendSo = JSON.stringify(nextData);
    network.POST({
      params: sendData,
      header: { 'content-type': 'application/json' },
      url: 'ognz/v2/activityEnrollEnjoy',
      success: function (requestData) {
        console.log('par:',requestData);
        rev(requestData, sendSo);

      },
      fail: function (res) {
        that.showAlert();
        that.setData({
          chooseSize: true,
        })
      },
    })
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



  onPageScroll: function (e) {
    console.log('实际滚动的scrollTop: ', e.detail.scrollTop);//{scrollTop:99}
  },


  pageScrollToBottom: function () {
    var len = this.data.QAArr.length + 1; //遍历的数组的长度  
    console.log('计算出来的scrollTop:',len * 200);
    this.setData({ scrollTop: len * 200 + 100});
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
      this.requestData();

    } else {
      //用户按了拒绝按钮
      console.log('拒绝使用')
    }
  },

  getUserOpenId: function (callback) {
    var self = this
    if (app.globalData.openId) {
      self.setData({
        openId: app.globalData.openId
      });
      callback(true, app.globalData.openId)
    } else {
      wx.login({
        success: function (data) {
          console.log(data);
          network.GET({
            params: {},
            url: 'wxmppay/jscode2session?appid=' + app.globalData.app_id + '&secret=' + app.globalData.app_secret + '&js_code=' + data.code,
            success: function (res) {
              app.globalData.openId = res.data.openid;
              self.setData({
                openId: res.data.openid
              });
              callback(true, res.data.openid);
            },
            fail: function (res) { },
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