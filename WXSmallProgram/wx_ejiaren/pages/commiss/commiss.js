var app = getApp();
var network = require('../../utils/network.js');
Page({
    data: {
        name:'',
        phone:'',
        shenFen:'学生',
        isIphoneX: app.globalData.isIphoneX,
        flag: true,
        showModal: false,
        itemId:'',
    },

    onLoad: function (options) {
        var item = JSON.parse(options.data);
        console.log ('item: ',item);
        this.setData({
            itemId: item.result.id + ''
        })
    },

    //用户名和密码输入框事件
    nameInput: function (e) {
        this.setData({
            name: e.detail.value
        })
    },
    phoneInput: function (e) {
        this.setData({
            phone: e.detail.value
        })
    },

    submitYuyue: function (e) {
        var that = this;
        setTimeout(() => {
            let errMess = '';
            if (this.data.name == "") {
                errMess = "用户名不能为空"
            } else if (this.data.phone == "") {
                errMess = "联系电话不能为空"
            }else {
                console.log(this.data);
                let sendData = {};
                sendData.id = this.data.itemId;
                sendData.contact_user = this.data.name;
                sendData.contact_phone = this.data.phone;
                sendData.type = this.data.shenFen;
                sendData.ognzId = app.globalData.ognz_id;
                console.log(sendData);
                network.GET(
                    {
                        params: sendData,
                        url: 'ognz/v2/recordActivity',
                        success: function (res) {
                            console.log('请求成功：', res);
                            that.show();
                        },
                        fail: function (res) {
                            console.log('请求失败:  ', res)
                        },
                    })
                return;
            }
            this.setData(
                { popErrorMsg: errMess}
            );
            this.ohShitfadeOut();
            return;
        }, 100)  ;
    },

    radioChange: function (e) {
        let value = parseInt(e.detail.value);
        let shenf = value == 1 ? '学生' : '家长';
        this.setData({
            shenFen: shenf,
        })
        console.log('radio发生change事件，携带value值为：', e.detail.value)
    },

    //定时器提示框3秒消失  
    ohShitfadeOut() {
        var fadeOutTimeout = setTimeout(() => {
            this.setData({ popErrorMsg: '' });
            clearTimeout(fadeOutTimeout);
        }, 3000);
    }, 

    /**
   * 弹出层函数
   */
    //出现
    show: function () {
        this.setData({
            showModal: true
        })
    },
    
    //消失
    hide: function () {
        this.setData({ showModal: false });
        setTimeout(() => {
            wx.navigateBack({})
        }, 500);
    },

    preventTouchMove: function () {},
})