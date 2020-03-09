// pages/exchange_result/exchange_result.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    amount: ''    // 兑换盛赞数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      amount: options.amount
    });
  },

  /**
   * 返回首页
   * 
   * @param:
   * @return:
   * @author: 黎俊鸿
   */
  toIndex() {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  }

})