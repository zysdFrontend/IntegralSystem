// pages/name_list/name_list.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    personList: [],       // 人员列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPersonList();
  },

  /**
   * 获取人员名单
   */
  getPersonList () {
    let openid = wx.getStorageSync('openid');
    wx.request({
      url: app.globalData.pathPrefix + '/gettop5',
      method: 'GET',
      data: {
        id: openid,
        count: 100
      },
      success: res => {
        if (res.data.result) {
          this.setData({
            personList: res.data.para1
          });
        }
      }
    })
  },

  /**
   * 跳转到转账页
   */
  toTrade(e) {
    let openid = e.currentTarget.dataset.id;
    if (openid === '-1') {    // 系统
      return;
    }
    wx.navigateTo({
      url: '/pages/trade/trade?scene=' + openid,
    })
  }

})