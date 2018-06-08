var network = require('../../utils/network.js');
var app = getApp();
Page({
    data: {
        tips: [
            {
                placeholder: '请留下您所在的公司全称',
                id: 0,
            },
            {
                placeholder: '请留下您的具体职位',
                id: 1,
            },
            {
                placeholder: '请留下您的大名',
                id: 2,
            },
            {
                placeholder: '请留下您的联系方式',
                id: 3,
            },
        ],
        inputValue: '',
        focusId: '',
        updateData: {},
        fromData: ['', '', '', ''],
        showModal: false,
        hidden: true,
    },
    realnameConfirm: function (e) {
        console.log(e);
    },

    bindFocus: function (event) {
        var id = event.currentTarget.dataset.id
        console.log(id)
        this.setData({
            focusId: id
        })
    },

    bindKeyInput: function (event) {
        var that = this;
        var value = event.detail.value
        var id = event.currentTarget.dataset.id;
        var fromData = that.data.fromData;
        fromData[id] = value;
        this.setData({
            fromData: fromData
        })
    },

    showAlert: function (i) {
        let message = '';
        switch (i) {
            case 0: message = '公司名称不能为空'; break;
            case 1: message = '职位不能为空'; break;
            case 2: message = '名称不能为空'; break;
            case 3: message = '联系方式不能为空'; break;
            default: message = ''; break;
        }
        wx.showModal({
            title: '提示',
            content: message,
            showCancel: false,
        })
    },

    submitData: function () {
        var fromData = this.data.fromData;
        var that = this;
        for (var i = 0; i < fromData.length; i++) {
            let ss = fromData[i];
            if (ss.length < 1) {
                this.showAlert(i);
                return;
            }
        }

        var data = {};
        data.company_name = fromData[0];
        data.position = fromData[1];
        data.contact_name = fromData[2];
        data.contact_phone = fromData[3];

        that.setData({
            hidden: false
        })

        network.POST(
            {
                params: data,
                url: 'company/enroll',
                success: function (res) {
                    console.log(res);
                    that.setData({
                        showModal: true,
                        hidden: true
                    })
                },
                fail: function (res) {
                    console.log('请求失败:  ', res)
                    that.setData({
                        hidden: true
                    })
                },
            })

    },
    confirmBtn: function () {
        this.setData({
            showModal: false
        })
    }

})