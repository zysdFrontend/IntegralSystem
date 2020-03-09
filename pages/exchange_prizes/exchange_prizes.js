// pages/exchange_prizes/exchange_prizes.js
import {
  userInfoChecked
} from '../../utils/util.js'

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tradePoints: '',           // 转账积分
    tradeId: 'o03qB4jeNDLV2KX5yaSAGG9f8X28',               // 兑换管理员id
    convertiblePoints: '',     // 可兑换积分
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    this.data.tradeId = options.tradeId || this.data.tradeId;
    userInfoChecked(function () {
      _this.getAccountInfo();
    });
  },

  /**
   * 获取个人积分详情
   * 
   * @param: 
   * @return:
   * @author: 黎俊鸿
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
        this.setData({
          convertiblePoints: res.data.para5
        });

      }
    })
  },

  /**
   * 绑定转账输入框的输入内容
   * 
   * @param: e 事件对象
   * @return:
   * @author: 黎俊鸿
   */
  tradePointsInput (e) {
    this.setData({
      tradePoints: e.detail.value
    });
  },

  /**
   * 确认兑换
   * 
   * @param: e 事件对象
   * @return:
   * @author: 黎俊鸿
   */
  confirmTrade (e) {
    let _this = this;
    let openid = wx.getStorageSync('openid');
    let tradePoints = this.data.tradePoints;
    let tradeId = this.data.tradeId;
    let formId = e.detail.formId;

    if (this.checkInput() === 1) {
      wx.showModal({
        title: '提示',
        content: '是否确定兑换？',
        confirmText: '确定',
        success: res => {
          if (res.confirm) {
            wx.showLoading({
              title: '加载中'
            });
            wx.request({
              url: app.globalData.pathPrefix + '/transaction',
              method: 'GET',
              data: {
                id: openid,
                amount: tradePoints,
                receiver: tradeId,
                formid: formId
              },
              success: (res) => {
                if (res.data.result) {
                  _this.setData({
                    tradePoints: ''
                  });
                  wx.navigateTo({
                    url: '/pages/exchange_result/exchange_result?amount=' + tradePoints,
                  })
                } else {
                  wx.showToast({
                    title: '转账失败',
                    icon: 'none'
                  })
                }
                // wx.hideLoading();
              },
              fail: (err) => {
                wx.hideLoading();
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      })
    }
  },

  /**
   * 校验输入
   * 
   * @param:
   * @return:
   * @author: 黎俊鸿
   */
  checkInput () {
    // 正整数正则
    const posPattern = /^\+?[1-9][0-9]*$/;

    if (!posPattern.test(this.data.tradePoints)) {
      wx.showToast({
        title: '请输入一个合法的正整数',
        icon: 'none'
      });
      return 0;
    } else if (parseInt(this.data.tradePoints) > parseInt(this.data.convertiblePoints)) {
      wx.showToast({
        title: '已超出可兑盛赞',
        icon: 'none'
      });
      return 0;
    } else {
      return 1;
    }
  },

  /**
   * 返回主页
   * 
   * @param:
   * @return:
   * @author: 黎俊鸿
   */
  toIndex() {
    wx.reLaunch({
      url: '/pages/index/index',
    });
  }

})