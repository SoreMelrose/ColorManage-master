const db = wx.cloud.database();
const app = getApp();
const list = db.collection('colorlist');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    time: '',
    colorpart1: [],
    foundcolor: [],
    colorlist: [],
    chooseindex: 0,
    messages: [{
        'union': 'XXX',
        'rank': '15°',
        'score': 80,
        'date': '2020/3/31',
        'name': 'XXX活动名称',
        'checked': false,
      },
      {
        'union': 'XXX',
        'rank': '45°',
        'score': 80,
        'date': '2020/3/31',
        'name': 'XXX活动名称',
        'checked': false,
      },
      {
        'union': 'XXX',
        'rank': '110°',
        'score': 80,
        'date': '2020/3/31',
        'name': 'XXX活动名称',
        'checked': false,
      }
    ]
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.currentTarget.dataset.id)
    let num = parseInt(e.currentTarget.dataset.id)
    let t = 'colorlist[' + e.currentTarget.dataset.id + '].checked'
    this.setData({
      [t]: !this.data.colorlist[num].checked,
      delindex: e.currentTarget.dataset.id,
      chooseindex: e.currentTarget.dataset._id
    })
  },
  choose1(e) {
    app.globalData.chooseid = this.data.chooseindex
    wx.switchTab({
      url: '/pages/color/color',
    })
  },
  choose2(e) {
    app.globalData.chooseidtofind = this.data.chooseindex
    wx.switchTab({
      url: '/pages/find/find',
    })
  },

  choose3(e) {
    console.log(this.data.chooseindex)
    wx.showModal({
      title: '确定',
      content: '确定要删除这条记录吗？',
      cancelText: '取消',
      confirmText: '确认删除',
      success: res => {
        if (res.confirm) {
          list.doc(this.data.chooseindex).remove({
            success: function (res) {
              console.log(res.data)
            }
          })
          this.data.colorlist.splice(this.data.delindex, 1);
          this.setData({
            colorlist: this.data.colorlist
          })
        }
      }
    })
  },
  clear1() {
    this.setData({
      name: ''
    })
  },
  clear2() {
    this.setData({
      time: ''
    })
  },
  getname(e) {
    this.setData({
      name: e.detail.value
    })
  },
  gettime(e) {
    this.setData({
      time: e.detail.value
    })
  },
  search() {
    if (this.data.name && this.data.time) {
      wx.showLoading({
        title: '加载中...',
        mask: true //显示触摸蒙层  防止事件穿透触发
      });
      var that = this
      wx.cloud.callFunction({
        name: 'searchcolor',
        data: {
          word: that.data.name,
          date: that.data.time
        },
        success: function (res) {
          console.log(res)
          wx.hideLoading()
          if (res.result.data.length) {
            wx.showToast({
              title: '找到数据！',
              duration: 1000,
            })
            that.setData({
              colorlist: res.result.data
            })
          } else {
            wx.showToast({
              title: '未找到数据！',
              duration: 1000,
            })
            that.setData({
              colorlist: []
            })
          }
        },
        fail: function (res) {
          console.log(res)
        }
      })
    } else {
      wx.showToast({
        title: '请输入名称时间',
        image: '/images/wrong.png',
        duration: 1000,
      })
    }
  },
  getRandomColor() {
    let rgb = []

    for (let i = 0; i < 3; ++i) {
      let color = Math.floor(Math.random() * 256).toString(16)
      color = (color.length == 1) ? '0' + color : color
      rgb.push(color)
    }
    return '#' + rgb.join('')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    list.get({
      success: function (res) {
        console.log(res)
        that.setData({
          colorlist: res.data
        })
      }
    })
  },
})