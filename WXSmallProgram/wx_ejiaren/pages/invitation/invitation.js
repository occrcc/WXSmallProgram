
var wxCharts = require('../../utils/wxcharts.js');
var network = require('../../utils/network.js');
var context = null;
var avatarCanvas = null;
var canvasw = 0;
var canvash = 0;
var avatarWidth = 0;
var imgHight = 0;
//获取系统信息  
wx.getSystemInfo({
    success: function (res) {
        canvasw = res.windowWidth;//设备宽度  
        canvash = res.windowHeight;
        imgHight = canvasw * 1.24;
        avatarWidth = res.windowWidth * 0.07;
    }
});




var radarChart = null;
var app = getApp();
Page({
    data: {
        userInfo: null,
        invitation: false,
        showImg: true,
        teacherInfo: {},
        canvasHiddle: 'block',
        starData: [],
        activitys: [],
        isIphoneX: app.globalData.isIphoneX,
        labs: [],
        tips: [],
        flgs: [],
        shareData: {},
        caverImageUrl:null,
        baseImgUrl: '',
        tipViewHidden: 'none',
        baseTipViewShow: false,
        tuijianImgUrl: 'http://pic.ejiarens.com/wx/tuijian_empty.png',
        saveImageUrl:'',
        shareSuccesDagta: {
            topImgUrl: '../../images/tuijian.png',
            contentText: '成功推荐，您和您的好友均可获得丰厚奖励',
        },
        initData:null,
        sharId:null,
    },

    onShareAppMessage: function () {
        return this.data.shareData
    },

    initData: function (item, options, res) {
        let star1 = parseInt(item.result.body.star1);
        let star2 = parseInt(item.result.body.star2);
        let star3 = parseInt(item.result.body.star3);
        let star4 = parseInt(item.result.body.star4);
        let star5 = parseInt(item.result.body.star5);
        let starArr = [star1, star2, star3, star4, star5];
        let isShowImg = item.result.body.pj.length > 0 ? false : true;
        let refereeRewardText = item.activity.body.refereeRewardText;
        let friendRewardText = item.activity.body.friendRewardText;
        if (!item.activity.body.teacherThumb || item.activity.body.teacherThumb.length < 1) {
            item.activity.body.teacherThumb = '../../images/01.png'
        }
        let activis = [];
        if (refereeRewardText.length > 0) {
            activis.push({ content: refereeRewardText, imgUrl: '../../images/jiangli.png' })
        }
        if (friendRewardText.length > 0) {
            activis.push({ content: friendRewardText, imgUrl: '../../images/btj.png' })
        }
        if (options.invitation) {
            this.setData({
                invitation: options.invitation,
                tuijianImgUrl: 'http://pic.ejiarens.com/wx/tuijian_empty_ds.png',
                shareSuccesDagta: {
                    topImgUrl: '../../images/yuetan.png',
                    contentText: '与大神成功组队后，即可获得丰厚大礼',
                }
            })
        }
        if (options.invitation) {
            item.nickName = this.filteremoji(item.nickName + '');
            item.avatarUrl = item.avatarUrl;
        } else {
            item.nickName = this.filteremoji(res.nickName + '');
            item.avatarUrl = res.avatarUrl;
        }
        
        this.setData({
            starData: starArr,
            teacherInfo: item,
            showImg: isShowImg,
            activitys: activis,
            shareData: {
                title: '[有人@我]给你推荐位大神，江湖人称“名校收割机”',
                imageUrl: 'http://pic.ejiarens.com/wx/wx_sharimg.png',
                path: '/pages/invitation/invitation?invitation=true&data=' + JSON.stringify(item),
            }
        })
        this.getHaibao();
        this.showCanvas();
        var teacherskills = item.activity.body.teacherskills.split(',');
        var teacherAt = item.activity.body.teacherAt.split(',');
        var teacherTags = item.activity.body.teacherTags.split(',');
        if (teacherskills.length > 0 && teacherskills) {
            this.setData({
                labs: teacherskills,
            })
        }
        var teachers = [];
        var teachersIconMap = {
            '美国': {
                url: 'meiguo.png'
            },
            '英国': {
                url: 'yingguo.png'
            },
            '加拿大': {
                url: 'jianada.png'
            },
            '台湾': {
                url: 'taiwan.png'
            },
            '德国': {
                url: 'deguo.png'
            },
            '新加坡': {
                url: 'xinjiapo.png'
            },
            '新西兰': {
                url: 'xinxilan.png'
            },
            '日本': {
                url: 'riben.png'
            },
            '法国': {
                url: 'faguo.png'
            },
            '澳大利亚': {
                url: 'aodaliya.png'
            },
            '澳门': {
                url: 'aomen.png'
            },
            '香港': {
                url: 'xianggang.png'
            },
            '其他': {
                url: 'qita.png'
            },
        }

        if (teacherAt.length > 0 && teacherAt) {
            for (let i = 0; i < teacherAt.length; i++) {
                let imgurl = '../../images/' + teachersIconMap[teacherAt[i]].url + '';
                teachers.push(imgurl);
            }
            this.setData({
                flgs: teachers,
            })
        }
        if (teacherTags.length > 0 && teacherTags) {
            this.setData({
                tips: teacherTags,
            })
        }
    },

    onReady: function () {
      if (!this.data.userInfo) {
        wx.redirectTo({
          url: '../authorization/authorization?page=invitation&invitation=' + this.data.invitation + '&sharid=' + this.data.sharId + '&data=' + this.data.initData,
        })
      }
    },

    onLoad: function (options) {
      var that = this;
      if (options.sharid) {
        this.setData({ sharId: options.sharid})
      }
      if (options.data) {
        this.setData({ initData: options.data })
      }
      if (options.invitation) {
        this.setData({ invitation: options.invitation })
      }

      this.loadUserInfo((res) => {
        if (parseInt(options.sharid) > 0) {
          network.GET({
            params: {},
            url: 'ognz/getActivityShareUserById/' + options.sharid,
            success: function (requestData) {
              var getitem = requestData.data;
              getitem.nickName = getitem.result.nickName;
              getitem.avatarUrl = getitem.result.avar;
              that.initData(getitem, options, res);
            },
            fail: function (res) {
              wx.showModal({
                title: '请检查网络连接',
                content: JSON.stringify(error),
                showCancel: false,
              })
            },
          })
        } else {
          var item = JSON.parse(options.data);
          that.initData(item, options, res);
        }
      });
      that.produceCanvasImg();
        // var a = [
        //   "Hydrogen",
        //   "Helium",
        //   "Lithium",
        //   "Beryl­lium"
        // ];
        // var a3 = a.map(s => s.length);  
        // console.log('a3:',a3);
    },

    

    produceCanvasImg:function(){
        var that = this;
        setTimeout(function () {
            wx.canvasToTempFilePath({
                x: 0,
                y: 0,
                quality: 1,
                width: 330,
                height: 330,
                destWidth: 660,
                destHeight: 660,
                canvasId: 'radarCanvas',
                success: function (res) {
                    console.log('caverImageUrl', res.tempFilePath);
                    that.setData({
                        caverImageUrl: res.tempFilePath,
                    })
                },
                fail: (err) => {
                    console.log(err)
                }
            })
        }, 800)
    },

    showCanvas: function (e) {
        radarChart = new wxCharts({
            canvasId: 'radarCanvas',
            type: 'radar',
            categories: ['经验值', '活力值', '专业知识', '办事效率', '认真负责'],
            series: [{
                name: '我的评分',
                data: this.data.starData,
                color:'#8FC6FF'
            }],
            width: canvasw,
            height: 200,
            extra: {
                radar: {
                    max: 5
                }
            }
        });
    },
    navBack: function () {
        wx.navigateBack({})
    },
    tuijian: function () {
        console.log("推荐");
        this.data.shareData;
    },
    yuyue: function () {
        wx.navigateTo({
            url: '../commiss/commiss?data=' + JSON.stringify(this.data.teacherInfo),
        })
    },

    loadUserInfo: function (backres) {
        var that = this;
        wx.getStorage({
            key: 'userInfo',
            success: function (res) {
                console.log("loadUsers1: ", res.data);
                that.setData({
                    userInfo: res.data,
                })
                backres(res.data);
            },
        })
    },

    showHaibao: function () {
        this.setData({
            baseTipViewShow: true,
        })
    },

   
    saveImage: function () {
        var that = this;
        console.log('saveImageUrl',that.data.saveImageUrl);
        wx.saveImageToPhotosAlbum({
            filePath: that.data.saveImageUrl,
            success: (res1) => {
                wx.showToast({
                    title: '保存成功',
                    icon: 'success',
                    duration: 2000
                })
            },
            fail: (err) => {
                wx.showModal({
                    title: 'error',
                    content: JSON.stringify(err) + that.data.saveImageUrl
                })
            }
        })
        setTimeout(function () {
            that.setData({
                baseTipViewShow: false,
            })
        }, 2000)
    },

    selectBaseImage: function () {
        this.setData({
            baseTipViewShow: false,
        })
    },

    sharTuijian: function () {
        this.setData({
            baseTipViewShow: false,
        })
        setTimeout(function () {
            this.data.shareData;
        }, 500)
    },

    getHaibao: function () {
        var that = this;
        let saveImageUrl = that.data.saveImageUrl;
        let baseImgUrl = that.data.baseImgUrl;
        if (saveImageUrl.length > 1 && baseImgUrl.length > 1) {
            return;
        }
        var userInfo = this.data.userInfo;
        var teacher = this.data.teacherInfo;
        var sendInfo = {};
        sendInfo.avarImg = userInfo.avatarUrl;
        sendInfo.nickname = this.filteremoji(userInfo.nickName + '');
        sendInfo.text = "\“为我的老师打CALL,进击吧！老师\”";
        sendInfo.appid = app.globalData.app_id;
        sendInfo.secret = app.globalData.app_secret;
        sendInfo.path = 'pages/invitation/invitation?invitation=true&sharid=' + teacher.result.id;
        console.log('sendInfo:' ,sendInfo);
        network.POST(
            {
                params: sendInfo,
                url: 'third/drawPoster',
                success: function (res1) {
                    var downUrl = res1.data.t;
                    downUrl = downUrl.replace('http://pic.ejiarens.com', 'https://wxpic.ejiarens.com');
                    console.log('downUrl:',downUrl);
                    wx.downloadFile({
                        url: downUrl,
                        success: function (res) {
                            that.setData({
                                saveImageUrl: res.tempFilePath,
                                baseImgUrl: res1.data.t,
                            })
                        },
                        fail: function (err) {
                            wx.showModal({
                                title: 'error',
                                content: JSON.stringify(err) 
                            })
                        },
                    })
                },
                fail: function (err) {
                    console.log('请求失败:  ', err)
                },
            })
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

})