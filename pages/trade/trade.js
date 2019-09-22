// pages/trade/trade.js
const app = getApp();

Page({
  data: {
    userInfo: {},
    receiverOpenId: '',
    receiverInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    availablePoints: '',       // 可用积分
    tradePoints: '',           // 转账积分
    reason: '',                // 转账理由
  },

  onLoad: function (options) {
    let openid = wx.getStorageSync('openid');
    if (!openid) {      // 没有微信id
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
      this.setData({
        receiverOpenId: options.scene
      })

      this.checkReceiver(this.data.receiverOpenId);
      this.onGetUserInfo();
      this.getAccountInfo();
      this.getReceiverInfo();
    }
  },

  /**
   * 判断转账对象是否合法
   */
  checkReceiver (receiverOpenId) {
    let openid = wx.getStorageSync('openid');
    if (openid === receiverOpenId) {    // 收款者是自己
      wx.showModal({
        title: '提示',
        content: '不能向自己转账',
        confirmText: '确定',
        showCancel: false,
        success: function (res) {
          wx.reLaunch({
            url: '/pages/index/index',
          })
        }
      });
    }
  },

  /**
   * 获取个人用户信息
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
   * 获取收款方用户信息
   */
  getReceiverInfo () {
    wx.request({
      url: app.globalData.pathPrefix + '/getuser',
      method: 'GET',
      data: {
        id: this.data.receiverOpenId    
      },
      success: (res) => {
        if (res.data.result) {          
          // 保存收款方用户信息
          let infoObj = {
            name: res.data.name,
            wxid: res.data.wxid,
            avatarUrl: res.data.url
          };
          this.setData({
            receiverInfo: infoObj
          })
        }
      }
    })
  },

  /**
   * 获取个人积分情况
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
        this.setData({
          availablePoints: res.data.para1
        })
      }
    })
  },

  /**
   * 绑定转账输入框的输入内容
   */
  tradePointsInput (e) {
    this.setData({
      tradePoints: e.detail.value
    })
  },

  /**
   * 确认转账
   */
  confirmTrade (e) {
    let _this = this;
    let openid = wx.getStorageSync('openid');
    let points = this.data.tradePoints;
    let receiverOpenId = this.data.receiverInfo.wxid;
    let remark = this.data.reason;

    if (this.checkInput() === 1) {
      wx.showModal({
        title: '提示',
        content: '是否确认转账？',
        confirmText: '确定',
        success: function (res) {
          wx.showLoading({
            title: '加载中'
          });
          if (res.confirm) {
            wx.request({
              url: app.globalData.pathPrefix + '/transaction',
              method: 'GET',
              data: {
                id: openid,
                amount: points,
                receiver: receiverOpenId,   
                remark: remark
              },
              success: (res) => {
                console.log(res);
                if (res.data.result) {
                  _this.setData({
                    tradePoints: ''
                  });
                  wx.navigateTo({
                    url: '/pages/trade_result/trade_result?amount=' + points,
                  })
                } else {
                  wx.showToast({
                    title: '转账失败',
                    icon: 'none'
                  })
                }
                wx.hideLoading();
              },
              fail: (err) => {
                wx.hideLoading();
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      });
    }
  },

  /**
   * 积分转账校验
   */
  checkInput() {
    // 正整数正则
    const posPattern = /^\+?[1-9][0-9]*$/;

    if (parseInt(this.data.tradePoints) > parseInt(this.data.availablePoints)) {
      // 转出积分大于可用积分
      wx.showToast({
        title: '已超出可用盛赞',
        icon: 'none'
      });
      return 0;
    } else if (!posPattern.test(this.data.tradePoints)) {
      wx.showToast({
        title: '请输入一个合法的正整数',
        icon: 'none'
      });
      return 0;
    } else {
      return 1;
    }
  },

  /**
   * 返回主页
   */
  toIndex () {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  }

})