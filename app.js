//app.js
App({
  onLaunch: function () {
    /* // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    }) */

    this.login();
    this.userAuthorized();
  },

  // 登录
  login () {
    console.log('登录');
    if (this.globalData.jsCode) { // 已有jsCode
      
    } else {    // 没有jsCode
      wx.login({
        success: res => {
          console.log('loginCode: ' + res.code);
          this.globalData.jsCode = res.code;
        }
      })
    }
  },

  // 判断用户授权状态
  userAuthorized () {
    wx.getSetting({
      success: res => {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        } else {
          wx.reLaunch({
            url: '/pages/authorize/authorize',
          })
        }
      }
    })
  },

  // 获取openId
  getOpenId () {
    
  },

  globalData: {
    userInfo: null,
    jsCode: null,
    authorized: null,
    // pathPrefix: 'http://192.168.13.74:8000'
    pathPrefix: 'https://jf.join-share.net'
  }
})