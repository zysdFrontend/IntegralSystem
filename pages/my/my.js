// pages/my/my.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},            // 用户信息
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    availablePoints: '',     // 可用积分
    receivedPoints: '',      // 收到积分
    totalPoints: '',         // 累计积分
    convertiblePoints: '',   // 可兑积分
    qecodeUrl: '',
    defaultPicShow: true,      // 二维码加载动画显示
    isPullDown: false,         // 下拉刷新
  },

  onLoad: function () {
    this.onGetUserInfo();
    this.getAccountInfo();
    this.getQRcodePic();
  },

  /**
   * 跳转到授权登录页
   */
  toLogin() {
    wx.navigateTo({
      url: '/pages/authorize/authorize'
    });
  },

  /**
   * 读取用户信息
   */
  onGetUserInfo() {
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
  getAccountInfo() {
    let openid = wx.getStorageSync('openid');
    wx.request({
      url: app.globalData.pathPrefix + '/getaccountinfo',
      method: 'GET',
      data: {
        id: openid
      },
      success: (res) => {
        if (res.data.result) {
          this.setData({
            availablePoints: res.data.para1,
            receivedPoints: res.data.para3,
            totalPoints: res.data.para2,
            convertiblePoints: res.data.para5
          })
        } else {
          wx.showToast({
            title: '积分信息获取失败',
            icon: 'none'
          });
        }
        if (this.data.isPullDown) {
          this.setData({
            isPullDown: false
          });
          wx.stopPullDownRefresh();
        }
      }
    })
  },

  /**
   * 获取二维码图片
   */
  getQRcodePic() {
    let openid = wx.getStorageSync('openid');
    let url = app.globalData.pathPrefix + '/getqrcode?id=' + openid;

    // 用于模拟二维码加载中动画效果
    /* setTimeout(()=>{
      this.setData({
        qecodeUrl: url
      })
    }, 2000); */

    this.setData({
      qecodeUrl: url
    });
  },

  /**
   * 二维码图片加载完成事件
   */
  handlePicLoad(e) {
    this.setData({
      defaultPicShow: false
    });
  },

  /**
   * 预览图片
   */
  previewPic() {
    let picUrl = this.data.qecodeUrl;
    console.log(picUrl);
    wx.previewImage({
      urls: [picUrl],
    })
  },

  toHistory() {
    wx.navigateTo({
      url: '/pages/trade_history/trade_history',
    })
  },

  /**
   * 监听下拉刷新
   */
  onPullDownRefresh() {
    this.setData({
      isPullDown: true
    });
    this.getAccountInfo();
  },

  /* getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  } */
})