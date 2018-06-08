var network = require('../../utils/network.js');
var app = getApp();
Page({
    data: {
        teacherInfo: null,
        isIphoneX: app.globalData.isIphoneX,
        labs: [],
        tips: [],
        flgs: [],
        userInfo: null,
        max: 50,
        currentWordNumber: 0,
        shareData:{},
        userStars: [
            '../../images/star_s.png',
            '../../images/star_n.png',
            '../../images/star_n.png',
            '../../images/star_n.png',
            '../../images/star_n.png'
        ],
        userStars2: [
            '../../images/star_s.png',
            '../../images/star_n.png',
            '../../images/star_n.png',
            '../../images/star_n.png',
            '../../images/star_n.png'
        ],
        userStars3: [
            '../../images/star_s.png',
            '../../images/star_n.png',
            '../../images/star_n.png',
            '../../images/star_n.png',
            '../../images/star_n.png'
        ],
        userStars4: [
            '../../images/star_s.png',
            '../../images/star_n.png',
            '../../images/star_n.png',
            '../../images/star_n.png',
            '../../images/star_n.png'
        ],
        userStars5: [
            '../../images/star_s.png',
            '../../images/star_n.png',
            '../../images/star_n.png',
            '../../images/star_n.png',
            '../../images/star_n.png'
        ],
        fenshu: [1, 1, 1, 1, 1],
        message: '',
        sharHomeDetailData:null,
        sourceItem:null,
    },

    onShareAppMessage: function () {
        return this.data.shareData
    },

    onReady: function () {
      if (!this.data.userInfo) {
        wx.redirectTo({
          url: '../authorization/authorization?page=homeDetails&item=' + this.data.sourceItem + '&sharHomeDetailData=' + this.data.sharHomeDetailData ,
        })
      }
    },

    onLoad: function (options) {
        this.loadUserInfo();
        if (options.sharHomeDetailData && options.sharHomeDetailData != 'null'){
            var sharItem = JSON.parse(options.sharHomeDetailData);
            this.setData({
                teacherInfo: sharItem.teacherInfo,
                flgs: sharItem.flgs,
                labs: sharItem.labs,
                tips: sharItem.tips,
                sharHomeDetailData: options.sharHomeDetailData,
            })
            return;
        }

        var item = JSON.parse(options.item);
        console.log('3123213123213123', item);
        this.setData({
            teacherInfo: item,
            sourceItem: options.item,
        })
        var sharItem = {};
        sharItem.labs = [];
        sharItem.tips = [];
        sharItem.flgs = [];
        sharItem.teacherInfo = item;
        var teacherskills = item.body.teacherskills.split(',');
        var teacherAt = item.body.teacherAt.split(',');
        var teacherTags = item.body.teacherTags.split(',');
        if (teacherskills.length > 0 && teacherskills) {
            sharItem.labs = teacherskills;
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
            sharItem.flgs = teachers;
            this.setData({
                flgs: teachers,
            })
        }
        if (teacherTags.length > 0 && teacherTags) {
            sharItem.tips = teacherTags;
            this.setData({
                tips: teacherTags,
                
            })
        }

        this.setData({
            shareData: {
                title: '[有人@我]这位大侠，请为我评个分打个CALL吧！',
                imageUrl: 'http://pic.ejiarens.com/wx/wx_sharimg1.png',
                path: '/pages/homeDetails/homeDetails?isShar=true&sharHomeDetailData=' + JSON.stringify(sharItem),
            }
        })
    },

    // 星星点击事件
    starTap: function (e) {
        var index = e.currentTarget.dataset.index; // 获取当前点击的是第几颗星星
        var fen = this.data.fenshu;
        fen[0] = index + 1;
        var tempUserStars = this.data.userStars; // 暂存星星数组
        var len = tempUserStars.length; // 获取星星数组的长度
        for (var i = 0; i < len; i++) {
            if (i <= index) { // 小于等于index的是满心
                tempUserStars[i] = '../../images/star_s.png'
            } else { // 其他是空心
                tempUserStars[i] = '../../images/star_n.png'
            }
        }
        // 重新赋值就可以显示了
        this.setData({
            userStars: tempUserStars,
            fenshu: fen
        })
    },
    // 星星点击事件
    starTap2: function (e) {
        var index = e.currentTarget.dataset.index; // 获取当前点击的是第几颗星星
        var fen = this.data.fenshu;
        fen[1] = index + 1;
        var tempUserStars = this.data.userStars2; // 暂存星星数组
        var len = tempUserStars.length; // 获取星星数组的长度
        for (var i = 0; i < len; i++) {
            if (i <= index) { // 小于等于index的是满心
                tempUserStars[i] = '../../images/star_s.png'
            } else { // 其他是空心
                tempUserStars[i] = '../../images/star_n.png'
            }
        }
        // 重新赋值就可以显示了
        this.setData({
            userStars2: tempUserStars,
            fenshu: fen
        })
    },
    // 星星点击事件
    starTap3: function (e) {
        var index = e.currentTarget.dataset.index; // 获取当前点击的是第几颗星星
        var fen = this.data.fenshu;
        fen[2] = index + 1;
        var tempUserStars = this.data.userStars3; // 暂存星星数组
        var len = tempUserStars.length; // 获取星星数组的长度
        for (var i = 0; i < len; i++) {
            if (i <= index) { // 小于等于index的是满心
                tempUserStars[i] = '../../images/star_s.png'
            } else { // 其他是空心
                tempUserStars[i] = '../../images/star_n.png'
            }
        }
        // 重新赋值就可以显示了
        this.setData({
            userStars3: tempUserStars,
            fenshu: fen
        })
    },
    // 星星点击事件
    starTap4: function (e) {
        var index = e.currentTarget.dataset.index; // 获取当前点击的是第几颗星星
        var fen = this.data.fenshu;
        fen[3] = index + 1;
        var tempUserStars = this.data.userStars4; // 暂存星星数组
        var len = tempUserStars.length; // 获取星星数组的长度
        for (var i = 0; i < len; i++) {
            if (i <= index) { // 小于等于index的是满心
                tempUserStars[i] = '../../images/star_s.png'
            } else { // 其他是空心
                tempUserStars[i] = '../../images/star_n.png'
            }
        }
        // 重新赋值就可以显示了
        this.setData({
            userStars4: tempUserStars,
            fenshu: fen
        })
    },
    // 星星点击事件
    starTap5: function (e) {
        var index = e.currentTarget.dataset.index; // 获取当前点击的是第几颗星星
        var fen = this.data.fenshu;
        fen[4] = index + 1;
        var tempUserStars = this.data.userStars5; // 暂存星星数组
        var len = tempUserStars.length; // 获取星星数组的长度
        for (var i = 0; i < len; i++) {
            if (i <= index) { // 小于等于index的是满心
                tempUserStars[i] = '../../images/star_s.png'
            } else { // 其他是空心
                tempUserStars[i] = '../../images/star_n.png'
            }
        }
        // 重新赋值就可以显示了
        this.setData({
            userStars5: tempUserStars,
            fenshu: fen
        })
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
        })
    },

    valueChange: function (e) {
        var that = this;
        console.log(e.detail.value);
        this.setData({
            message: e.detail.value,
        })

        var value = e.detail.value;
        var len = parseInt(value.length);
        if (len > this.data.max) return;
        this.setData({
            currentWordNumber: len //当前字数    
        });
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


    submit: function () {
        console.log('fenshu: ', this.data.fenshu);
        var fen = this.data.fenshu;
        var fenAdd = 0;
        for (var i = 0; i < fen.length; i++ ){
            fenAdd += parseInt(fen[i]);
        }
        if (fenAdd < 6){
            wx.showModal({
                showCancel: false,
                title: '提示',
                content: '你还没打分呢',
                success: function (res) {
                }
            })
            return;
        }

        var data = {};
        data.pj = this.filteremoji(this.data.message + '');
        data.nickName = this.filteremoji(this.data.userInfo.nickName + '');
        data.star1 = this.data.fenshu[0] + '';
        data.star2 = this.data.fenshu[1] + '';
        data.star3 = this.data.fenshu[2] + '';
        data.star4 = this.data.fenshu[3] + '';
        data.star5 = this.data.fenshu[4] + '';
        data.id = this.data.teacherInfo.id + '';
        data.avar = this.data.userInfo.avatarUrl;
        data.ognzId = app.globalData.ognz_id;
        console.log('message: ', data);

        network.GET(
            {
                params: data,
                url: 'ognz/shareActivityV2',
                success: function (res) {
                    console.log('请求成功：', res);
                    wx.navigateTo({
                        url: '../invitation/invitation?data=' + JSON.stringify(res.data.t)
                    })
                },
                fail: function (error) {
                    wx.showModal({
                        title: '网络错误',
                        content: JSON.stringify(error),
                        showCancel:false,
                    })
                },
            })
    }
})