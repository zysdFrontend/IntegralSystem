//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    bannerImg: 'https://jf.join-share.net/static/banner.jpg?v=' + new Date().getDate(),
    transactionList: [],      // 交易记录
    currentPage: null,        // 当前页码
    totalPages: null,         // 总页数
    isPullDown: false,        // 下拉刷新
    bottomLoading: false,     // 底部列表加载
  },

  onLoad: function () {
    this.initTransactionList();
  },

  /**
   * 监听下拉刷新
   * 
   * @param:
   * @return:
   * @author: 黎俊鸿
   */
  onPullDownRefresh () {
    this.setData({
      isPullDown: true
    });
    this.initTransactionList();
  },

  /**
   * 初始化交易记录列表
   * 
   * @param:
   * @return:
   * @author: 黎俊鸿
   */
  initTransactionList () {
    wx.showLoading();
    wx.request({
      url: app.globalData.pathPrefix + '/transactionhistory',
      method: 'GET',
      data: {
        page: 1
      },
      success: (res) => {
        if (res.data.result) {
          this.setData({
            transactionList: res.data.para1,
            currentPage: 1,
            totalPages: res.data.totalpages
          });
        } else {
          wx.showToast({
            title: '列表数据获取失败',
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
      }
    })
  },

  /**
   * 加载更多
   * 
   * @param:
   * @return:
   * @author: 黎俊鸿
   */
  loadMore () {
    if (this.isLocked()) {  // 处于加锁状态
      return;
    }
    if (this.hasMore()) {   // 是否有更多数据
      this.setData({
        bottomLoading: true
      });
      let nextPage = this.data.currentPage + 1;
      wx.request({
        url: app.globalData.pathPrefix + '/transactionhistory',
        method: 'GET',
        data: {
          page: nextPage
        },
        success: (res) => {
          if (res.data.result) {
            let tempResList = this.data.transactionList.concat(res.data.para1);
            this.setData({
              transactionList: tempResList,
              currentPage: nextPage,
              totalPages: res.data.totalpages
            });
          } else {
            wx.showToast({
              title: '列表数据获取失败',
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
   * 页面上拉触底事件的处理函数
   * 
   * @param:
   * @return:
   * @author: 黎俊鸿
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
  isLocked () {
    return this.data.bottomLoading ? true : false;
  },

  /**
   * 加锁
   * 
   * @param:
   * @return:
   * @author: 黎俊鸿
   */
  lock () {
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
  unLock () {
    this.setData({
      bottomLoading: false
    });
  },

  /**
   * 判断是否有更多数据
   */
  hasMore () {
    if (this.data.currentPage < this.data.totalPages) {
      return true;
    } else {
      return false;
    }
  },

  /**
   * 调用相机扫二维码
   * 
   * @param:
   * @return:
   * @author: 黎俊鸿
   */
  getScancode () {
    wx.scanCode({
      success: (res) => {
        console.log(res);
        wx.navigateTo({
          url: '/' + res.path
        })
      }
    });
  },

  /**
   * 用户点击右上角分享
   * 
   * @param:
   * @return:
   * @author: 黎俊鸿
   */
  onShareAppMessage: function () {
    return {
      title: '全城盛赞，还不赶紧加入？',
      path: '/pages/index/index'
    }
  },

  /**
   * 跳转到转账页
   * 
   * @param:
   * @return:
   * @author: 黎俊鸿
   */
  toTrade (e) {
    let openid = e.currentTarget.dataset.id;
    if (openid === '-1') {    // 系统
      return;
    }
    wx.navigateTo({
      url: '/pages/trade/trade?scene=' + openid,
    })
  },

  /**
   * 跳转到送赞人员列表页
   * 
   * @param:
   * @return:
   * @author: 黎俊鸿
   */
  toNameList () {
    wx.navigateTo({
      url: '/pages/name_list/name_list',
    });
  }
})
