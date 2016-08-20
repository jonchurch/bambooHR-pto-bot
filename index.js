
'use strict';
const request = require('request-promise-native')
// const Botkit = require('botkit')
const parseXml = require('xml2js').parseString
const moment = require('moment')
require('moment-range')

// I am going to loop through the xml data and parse out the names, and dates of the requests. I need to format the requests, add multiple requests from the same person into a single line, and send a string to botkit
function whosOut(){
  const options = {
    url: 'https://545bd8cff15256e49319d84abed36c6c0c7e44e4:x@api.bamboohr.com/api/gateway.php/indica/v1/time_off/whos_out'
  }
  request(options).then(function(xml){
    parseXml(xml, function(err, result) {
      const resultArr = []
      const weekStart = moment().startOf('isoweek')
      const weekEnd = moment().endOf('isoweek').subtract('2', 'days')
      const weekRange = moment.range(weekStart, weekEnd)
        for (let i = 0; i < result.calendar.item.length; i += 1){

          const single = result.calendar.item[i]
          const resObj = {name: single.employee[0]._, days: []}

          const startDate = moment(single.start[0])
          const endDate = moment(single.end[0])
          const requestRange = moment.range(startDate, endDate)

          const daysOffArray = weekRange.intersect(requestRange).toArray('days')
          for (let i = 0; i < daysOffArray.length; i += 1) {



            resObj.days.push(daysOffArray[i].format('dddd'))


          }
          resultArr.push(resObj)

          }
          console.log('result array',resultArr)


    })
  })
}

whosOut()
