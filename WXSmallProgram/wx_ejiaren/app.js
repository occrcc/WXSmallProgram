
const openIdUrl = require('./config').openIdUrl
//app.js
App({
    onLaunch: function () {
        console.log('App Launch')
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
        app_id:'wxdcd3e1f2d5c97b8f',
        app_secret:'a0d4fc5d1b7d8195086fa0c4c46e5954',
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
})