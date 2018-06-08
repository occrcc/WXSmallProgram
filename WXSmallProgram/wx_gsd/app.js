
const openIdUrl = require('./config').openIdUrl
//app.js
App({
    onLaunch: function () {
        console.log('App Launch')
    },
    onShow: function () {
        console.log('App Show')
    },
    onHide: function () {
        console.log('App Hide')
    },
    globalData: {
        isIphoneX: false,
        userInfo: null,
        hasLogin: false,
        openid: null,
        ognz_id:'275',
    },
    onShow: function () {
        let that = this;
        wx.getSystemInfo({
            success: res => {
                // console.log('手机信息res'+res.model)  
                let modelmes = res.model;
                if (modelmes.search('iPhone X') != -1) {
                    that.globalData.isIphoneX = true
                }
            }
        })
    },
    getUserOpenId: function (callback) {
        var self = this
        if (self.globalData.openid) {
            callback(null, self.globalData.openid)
        } else {
            wx.login({
                success: function (data) {
                    wx.request({
                        url: openIdUrl,
                        data: {
                            code: data.code
                        },
                        success: function (res) {
                            console.log('拉取openid成功', res)
                            self.globalData.openid = res.data.openid
                            callback(null, self.globalData.openid)
                        },
                        fail: function (res) {
                            console.log('拉取用户openid失败，将无法正常使用开放接口等服务', res)
                            callback(res)
                        }
                    })
                },
                fail: function (err) {
                    console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
                    callback(err)
                }
            })
        }
    }
})