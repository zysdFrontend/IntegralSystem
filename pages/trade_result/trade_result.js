// pages/trade_result/trade_result.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: wx.getStorageSync('openid'),  // openid
    tradePoints: '',         // 转出积分
    availablePoints: '',     // 可用积分
    sentPoints: '',          // 送出积分
    receivedPoints: '',      // 获得积分
    totalPoints: '',         // 累计积分
    rankList: [],            // 排名数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      tradePoints: options.amount
    })

    this.getAccountInfo();
    this.getRankInfo();
  },

  /**
   * 获取个人积分情况
   */
  getAccountInfo() {
    wx.request({
      url: app.globalData.pathPrefix + '/getaccountinfo',
      method: 'GET',
      data: {
        id: this.data.openid
      },
      success: (res) => {
        this.setData({
          availablePoints: res.data.para1,
          sentPoints: res.data.para4,
          receivedPoints: res.data.para3,
          totalPoints: res.data.para2
        })
      }
    })
  },

  /**
   * 获取前5排名数据
   */
  getRankInfo () {
    wx.request({
      url: app.globalData.pathPrefix + '/gettop5',
      method: 'GET',
      data: {
        id: this.data.openid
      },
      success: (res) => {
        console.log(res);
        if (res.data.result) {
          this.setData({
            rankList: res.data.para1
          });
        }
      }
    })
  }

})