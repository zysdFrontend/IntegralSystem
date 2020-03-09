// pages/trade/trade.js
import {
  userInfoChecked
} from '../../utils/util.js';

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
    tagsArr: [],               // 所有标签
    selectedTagId: '',         // 选中的标签id
  },

  onLoad: function (options) {
    let _this = this;
    userInfoChecked(function(){
      _this.setData({
        receiverOpenId: options.scene
      })

      _this.checkReceiver(_this.data.receiverOpenId);
      _this.onGetUserInfo();
      _this.getAccountInfo();
      _this.getReceiverInfo();
      _this.getTags();
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getAccountInfo();
  },

  /**
   * 判断转账对象是否合法
   * 
   * @param:
   * @return:
   * @author: 黎俊鸿
   */
  checkReceiver (receiverOpenId) {
    let openid = wx.getStorageSync('openid');
    if (openid === receiverOpenId) {    // 收款者是自己
      wx.showModal({
        title: '提示',
        content: '不能赞赏自己',
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
   * 
   * @param:
   * @return:
   * @author: 黎俊鸿
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
   * 
   * @param:
   * @return:
   * @author: 黎俊鸿
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
   * 
   * @param:
   * @return:
   * @author: 黎俊鸿
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
        });

      }
    })
  },

  /**
   * 获取标签
   * 
   * @param:
   * @return:
   * @author: 黎俊鸿
   */
  getTags () {
    wx.request({
      url: app.globalData.pathPrefix + '/getmarktag',
      method: 'GET',
      data: {

      },
      success: (res) => {
        if (res.data.result) {
          let tempArr = res.data.para1;
          this.setData({
            tagsArr: tempArr
          });
        }
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
    })
  },

  /**
   * 绑定转账理由的输入内容
   * 
   * @param: e 事件对象
   * @return:
   * @author: 黎俊鸿
   */
  tradeReasonInput (e) {
    this.setData({
      reason: e.detail.value
    });
  },

  /**
   * 标签点击事件
   * 
   * @param: e 事件对象
   * @return:
   * @author: 黎俊鸿
   */
  handleTagTap (e) {
    let id = e.currentTarget.dataset.id;
    if (id === this.data.selectedTagId) {   // 点击tag与当前选中tag相同
      this.setData({
        selectedTagId: ''
      });
    } else {      // 点击tag与当前选中tag不同
      this.setData({
        selectedTagId: id
      });
    }
  },

  /**
   * 确认转账
   * 
   * @param:
   * @return:
   * @author: 黎俊鸿
   */
  confirmTrade (e) {
    let _this = this;
    let openid = wx.getStorageSync('openid');
    let points = this.data.tradePoints;
    let receiverOpenId = this.data.receiverInfo.wxid;
    let remark = this.data.reason;
    let selectedTagId = this.data.selectedTagId;

    console.log(e.detail.formId)
    let formId = e.detail.formId;

    if (this.checkInput() === 1) {
      if (this.checkMostPoints() === 0) {
        return;
      }
      console.log('输入校验通过');
      wx.showModal({
        title: '提示',
        content: '是否确认赞赏？',
        confirmText: '确定',
        success: function (res) {
          if (res.confirm) {
            wx.showLoading({
              title: '加载中'
            });
            wx.request({
              url: app.globalData.pathPrefix + '/transaction',
              method: 'GET',
              data: {
                id: openid,
                amount: points,
                receiver: receiverOpenId,   
                remark: remark,
                tag: selectedTagId,
                formid: formId
              },
              success: (res) => {
                if (res.data.result) {
                  _this.setData({
                    tradePoints: '',
                    reason: '',
                    selectedTagId: ''
                  });
                  wx.navigateTo({
                    url: '/pages/trade_result/trade_result?amount=' + points,
                  })
                } else {
                  wx.hideLoading();
                  wx.showToast({
                    title: '转账失败',
                    icon: 'none',
                    duration: 2000
                  });
                }
                /* setTimeout(function() {
                  wx.hideLoading();
                }, 2000); */
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
   * 
   * @param:
   * @return:
   * @author: 黎俊鸿
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
    } else if (this.data.reason === '') {
      wx.showToast({
        title: '请填写送赞理由',
        icon: 'none'
      });
      return 0;
    } else if (this.data.selectedTagId === '') {
      wx.showToast({
        title: '请选择送赞分类',
        icon: 'none'
      });
      return 0;
    } else {
      return 1;
    }
  },

  /**
   * 根据送赞类别判断送赞上限
   * 
   * @param:
   * @return:
   * @author: 黎俊鸿
   */
  checkMostPoints () {
    let _this = this;
    let currentSelectedTagId = this.data.selectedTagId;
    let tradePoints = this.data.tradePoints;
    for (let i = 0; i < this.data.tagsArr.length; i++) {
      if (currentSelectedTagId === this.data.tagsArr[i].id) {
        if (parseInt(this.data.tagsArr[i].top) === 0) {
          return 1;
        }
        if (tradePoints > this.data.tagsArr[i].top) {
          wx.showToast({
            title: '该类别送赞数量不能超过' + _this.data.tagsArr[i].top,
            icon: 'none'
          });
          return 0;
        } else {
          return 1;
        }
      }
    }
  },

  /**
   * 返回主页
   * 
   * @param:
   * @return:
   * @author: 黎俊鸿
   */
  toIndex () {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  }

})