// pages/rank/rank.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},       // 用户信息
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    top3Arr: [],        // Top3
    myRank: '',         // 我的排名
    userPointsInfo: {}, // 个人积分情况
    top4To10Arr: [],    // 第4-10名    
    isPullDown: false,  // 下拉刷新
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let openid = wx.getStorageSync('openid');
    if (!openid) {    // 没有openid
      wx.showModal({
        title: '提示',
        content: '未登录授权，无法使用',
        confirmText: '授权',
        success: function (res) {
          if (res.confirm) {
            wx.reLaunch({
              url: '/pages/authorize/authorize'
            });
          }
        }
      });
    } else {
      this.getRankInfo();
      this.onGetUserInfo();
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      isPullDown: true
    });
    this.getRankInfo();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 获取排行榜数据
   */
  getRankInfo () {
    wx.showLoading();
    let openid = wx.getStorageSync('openid');
    wx.request({
      url: app.globalData.pathPrefix + '/gettop5',
      method: 'GET',
      data: {
        id: openid,
        count: 10
      },
      success: (res) => {
        if (res.data.result) {
          this.handleRankArr(res.data.para1);
          this.setData({
            myRank: res.data.para2,
            userPointsInfo: res.data.para3
          })
        } else {
          wx.showToast({
            title: '排行榜数据获取失败',
            icon: 'none'
          });
        }
        if (this.data.isPullDown) {
          wx.stopPullDownRefresh();
        }
        wx.hideLoading();
      }
    })
  },

  /**
   * 对排行榜数据数组进行处理
   */
  handleRankArr (arr) {
    if (arr.length <= 3) {

    } else {
      let top3 = arr.slice(0, 3);
      let top4To10 = arr.slice(3);
      this.setData({
        top3Arr: top3,
        top4To10Arr: top4To10
      });
    }
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

})