// pages/trade_history/trade_history.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    historyList: [],      // 历史记录列表
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
      this.getHistoryList();
    }
  },

  /**
   * 获取历史记录
   */
  getHistoryList () {
    let openid = wx.getStorageSync('openid');
    wx.request({
      url: app.globalData.pathPrefix + '/transactionhistory',
      method: 'GET',
      data: {
        id: openid
      },
      success: (res) => {
        if (res.data.result) {
          let resList = res.data.para1;
          // 循环转账记录列表，添加展开标志位
          for (let i = 0; i < resList.length; i++) {    
            resList[i].unfold = false;
          }
          this.setData({
            historyList: res.data.para1
          })
        }
      }
    });
  },

  /**
   * 列表数据展开事件
   */
  onUnfold (e) {
    let itemInfo = e.currentTarget.dataset.item;
    let historyList = this.data.historyList;
    let unfoldItemIndex;
    // 循环转账记录
    for (let i = 0; i < historyList.length; i++) {
      if (historyList[i].transactionid === itemInfo.transactionid) {
        unfoldItemIndex = i;
        break;
      }
    }
    let itemUnfold = 'historyList[' + unfoldItemIndex + '].unfold';
    this.setData({
      [itemUnfold]: !itemInfo.unfold    // 改变选中数据项的展开状态
    })
  }

})