// pages/authorize/authorize.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('授权页面jsCode: ' + app.globalData.jsCode)
    console.log('授权页面userInfo: ' + app.globalData.userInfo)
  },

  /**
   * 授权登录获取用户信息，并获取openid
   * 
   * @param: e 事件对象
   * @return:
   * @author: 黎俊鸿
   */
  bindGetUserInfo (e) {
    let _this = this;
    if (e.detail.userInfo) {  // 用户点击允许
      console.log(e.detail.userInfo);
      app.globalData.userInfo = e.detail.userInfo;
      app.globalData.authorized = true;
      wx.request({
        url: app.globalData.pathPrefix + '/adduser',
        method: 'GET',
        data: {
          code: app.globalData.jsCode,
          name: app.globalData.userInfo.nickName,
          url: app.globalData.userInfo.avatarUrl
        },
        success: res => {
          console.log('微信id：' + res.data.wxid);
          if (res.data.result) {
            // 本地保存openid
            wx.setStorageSync('openid', res.data.wxid);
            wx.reLaunch({
              url: '/pages/index/index'
            })
          } else {
            wx.showModal({
              title: '错误',
              content: '获取微信ID失败，请联系管理员！',
              showCancel: false,
              confirmText: '返回',
              success: function (res) {
                
              }
            });
          }
        },
        fail: (err) => {
          console.log(err);

        }
      })
    } else {    // 用户点击拒绝

    }
  }

})