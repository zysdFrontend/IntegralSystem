const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 判断用户信息授权状态及openid状态
 */
const userInfoChecked = (callback) => {
  // 检测openid
  let openid = wx.getStorageInfoSync('openid');
  console.log('本地缓存openid: ' + openid);
  if (!openid) {
    console.log('本地缓存没有openid');
    wx.showModal({
      title: '提示',
      content: '未登录授权，无法使用',
      confirmText: '授权',
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/authorize/authorize'
          });
        }
      }
    });

    return;
  }

  // 检测用户信息授权状态
  wx.getSetting({
    success: (res) => {
      if (res.authSetting['scope.userInfo']) {  // 已经授权
        callback && callback();
      } else {
        wx.showModal({
          title: '提示',
          content: '未登录授权，无法使用',
          confirmText: '授权',
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/authorize/authorize'
              });
            }
          }
        });
      }
    }
  });
}

/**
 * 判断用户信息授权状态及openid状态（用于“我的”页面）
 */
const userInfoCheckedMy = (callback) => {
  // 检测openid
  let openid = wx.getStorageInfoSync('openid');
  console.log('本地缓存openid: ' + openid);
  if (!openid) {
    return;
  }

  // 检测用户信息授权状态
  wx.getSetting({
    success: (res) => {
      if (res.authSetting['scope.userInfo']) {  // 已经授权
        callback && callback();
      } else {
        
      }
    }
  });
}

module.exports = {
  formatTime: formatTime,
  userInfoChecked: userInfoChecked,
  userInfoCheckedMy: userInfoCheckedMy
}
