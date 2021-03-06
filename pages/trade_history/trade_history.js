// pages/trade_history/trade_history.js
import {
  userInfoChecked
} from '../../utils/util.js';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    historyList: [],      // 历史记录列表
    currentPage: null,    // 当前页码
    totalPage: null,      // 总页数
    isPullDown: false,    // 下拉刷新
    bottomLoading: false  // 底部列表加载
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    userInfoChecked(function(){
      _this.getHistoryList();
    });
  },

  /**
   * 获取历史记录
   * 
   * @param:
   * @return:
   * @author: 黎俊鸿
   */
  getHistoryList () {
    let openid = wx.getStorageSync('openid');
    wx.showLoading();
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
            historyList: res.data.para1,
            currentPage: res.data.currentpage,
            totalPages: res.data.totalpages
          })
        } else {
          wx.showToast({
            title: '账单数据获取失败',
            icon: 'none'
          });
        }
        if (this.data.isPullDown) {
          this.setData({
            isPullDown: false
          });
          wx.stopPullDownRefresh();
        }
        wx.hideLoading();
      },
      fail: (err) => {
        wx.hideLoading();
        console.log(err);
      }
    });
  },

  /**
   * 加载更多
   * 
   * @param:
   * @return:
   * @author: 黎俊鸿
   */
  loadMore () {
    if (this.isLocked()) {    // 处于加锁状态
      return;
    } 
    if (this.hasMore()) {     // 是否有更多数据
      this.setData({
        bottomLoading: true
      });
      let openid = wx.getStorageSync('openid');
      let nextPage = this.data.currentPage + 1;
      wx.request({
        url: app.globalData.pathPrefix + '/transactionhistory',
        method: 'GET',
        data: {
          id: openid,
          page: nextPage
        },
        success: (res) => {
          if (res.data.result) {
            let tempResList = this.data.historyList.concat(res.data.para1);
            this.setData({
              historyList: tempResList,
              currentPage: res.data.currentpage,
              totalPage: res.data.totalPage
            });
          } else {
            wx.showToast({
              title: '账单数据获取失败',
              icon: 'none'
            });
          }
          this.setData({
            bottomLoading: false
          });
        }
      })
    } 
  },

  /**
   * 监听下拉刷新
   */
  onPullDownRefresh () {
    this.setData({
      isPullDown: true
    });
    this.getHistoryList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom () {
    this.loadMore();
  },

  /**
   * 判断是否处于加锁状态，防止加载更多请求频繁触发
   * 
   * @param:
   * @return:
   * @author: 黎俊鸿
   */
  isLocked() {
    return this.data.bottomLoading ? true : false;
  },

  /**
   * 加锁
   * 
   * @param:
   * @return:
   * @author: 黎俊鸿
   */
  lock() {
    this.setData({
      bottomLoading: true
    });
  },

  /**
   * 解锁
   * 
   * @param:
   * @return:
   * @author: 黎俊鸿
   */
  unLock() {
    this.setData({
      bottomLoading: false
    });
  },

  /**
   * 判断是否有更多数据
   * 
   * @param:
   * @return:
   * @author: 黎俊鸿
   */
  hasMore() {
    if (this.data.currentPage < this.data.totalPages) {
      return true;
    } else {
      return false;
    }
  },

  /**
   * 跳转到转账页
   * 
   * @param:
   * @return:
   * @author: 黎俊鸿
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