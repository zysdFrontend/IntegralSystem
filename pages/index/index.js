//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},            // 用户信息
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    availablePoints: '',     // 可用积分
    receivedPoints: '',      // 收到积分
    totalPoints: '',         // 累计积分
    qecodeUrl: ''
  },

  onLoad: function () {
    this.onGetUserInfo();
    this.getAccountInfo();
    this.getQRcodePic();
  },

  /**
   * 读取用户信息
   */
  onGetUserInfo () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo
        })
      }
    }
  },

  /**
   * 获取个人积分详情
   */
  getAccountInfo () {
    let openid = wx.getStorageSync('openid');
    wx.request({
      url: app.globalData.pathPrefix + '/getaccountinfo',
      method: 'GET',
      data: {
        id: openid
      },
      success: (res) => {
        console.log(res);
        this.setData({
          availablePoints: res.data.para1,
          receivedPoints: res.data.para4,
          totalPoints: res.data.para2
        })
      }
    })
  },

  /**
   * 获取二维码图片
   */
  getQRcodePic () {
    let openid = wx.getStorageSync('openid');
    let url = app.globalData.pathPrefix + '/getqrcode?id=' + openid;
    this.setData({
      qecodeUrl: url
    })
  },

  /**
   * 预览图片
   */
  previewPic () {
    let picUrl = this.data.qecodeUrl;
    wx.previewImage({
      urls: [picUrl],
    })
  },

  toHistory () {
    wx.navigateTo({
      url: '/pages/trade_history/trade_history',
    })
  }

  /* getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  } */
})
