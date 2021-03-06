// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const base = db.command
  var a = event.word ? event.word : ''
  var b = event.date ? event.date : ''
  try {
    return await db.collection('colorlist').where(base.or([{
        name: db.RegExp({
          regexp: a,
          options: 'i', //不区分大小写
        })
      },
      {
        date: db.RegExp({
          regexp: b,
          options: 'i', //不区分大小写
        })
      }
    ])).get({
      success: function (res) {
        console.log(res)
      }
    })
  } catch (e) {
    console.log(e)
  }
}