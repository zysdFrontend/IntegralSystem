// pages/rank/rank.js
import {
  userInfoChecked
} from '../../utils/util.js';

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
    let _this = this;
    userInfoChecked(function(){
      _this.getRankInfo();
      _this.onGetUserInfo();
    });
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '争先创优，追赶超越，快来看看你的排名！',
      path: '/pages/rank/rank'
    }
  }
})