'use strict';
const request = require('request-promise-native')
const Botkit = require('botkit')
const parseXml = require('xml2js').parseString
const moment = require('moment')
require('moment-range')
const _ = require('lodash')
const controller = Botkit.slackbot({})

const bot = controller.spawn({
    incoming_webhook: {
        url: process.env.SLACK_WEBHOOK
    }
})

function whosOut() {
    console.log('Whos out running')

    const options = {
        url: 'https://' + process.env.BAMBOOHR_TOKEN + ':x@api.bamboohr.com/api/gateway.php/' + process.env.BAMBOOHR_SUBDOMAIN + '/v1/time_off/whos_out/?start=2016-09-1&end=2016-12-31'
    }

    request(options).then(function(xml) {
        parseXml(xml, function(err, result) {
            let formArr = []
            const requestResult = []
            const holiResult = []
            const holiFormArr = ['Company Holidays \n']
                //Setting week start to Monday
            const weekStart = moment().startOf('isoweek')
                // const weekStart = moment().startOf('isoweek')
                //Setting week end to Friday
                // const weekEnd = moment().endOf('isoweek').subtract('2', 'days')
            const weekEnd = moment().endOf('isoweek').add(1, 'months')
            const weekRange = moment.range(weekStart, weekEnd)
            for (let i = 0; i < result.calendar.item.length; i += 1) {
                console.log('LOOPING', result.calendar.item);
                const index = result.calendar.item[i]
                const startDate = moment(index.start[0])
                const endDate = moment(index.end[0])
                const requestRange = moment.range(startDate, endDate)

                if (index.$.type === 'holiday') {
                    const holidayObj = {
                        name: index.holiday[0]._,
                        days: []
                    }

                    const holiRangeArray = moment.range(startDate, endDate).toArray('days')

                    for (var k = 0; k < holiRangeArray.length; k += 1) {
                        holidayObj.days.push(holiRangeArray[k].format('MM/DD'))
                    }
                    holiResult.push(holidayObj)
                    continue


                    console.log('HOLILENGTH', holiResult.length);
                    for (let l = 0; l < holiResult.length; l += 1) {
                        let _arr = []
                        _arr.push('>' + '*' + holiResult[l].name + '*')
                        _arr.push('_' + holiResult[l].days.join(', ') + '_')
                        _arr = _arr.join(': ')
                        holiFormArr.push(_arr)
                        console.log("HOLIRESULT IN FORM LOOP", holiResult[l]);

                    }
                    // formArr.push(holiFormArr)
                    console.log('FORMARR!!!!!!HOLIdAY STYLE', formArr);
                    console.log('HOLIFORM YALL!', holiFormArr);
                    console.log('RANGE!!!!', holidayObject);

                    // console.log('HOLIDAYS=\n',index.holiday)

                    // console.log('Holiday Name',index.holiday[0]._)

                    // const holiObj = { name: index.holiday,
                    //     days: []}
                    // const holiRange = moment.range(index.start[0], index.end[0]).toArray('days')
                    // holiRange[0].forEach(function(element){
                    //   holiResult.push(element.format('dddd'))
                    // });
                    // holiArr.push
                    // continue

                } else {

                    const resObj = {
                        name: index.employee[0]._,
                        days: []
                    }

                    if (requestRange.overlaps(weekRange)) {
                        const daysOffArray = weekRange.intersect(requestRange).toArray('days')
                        for (let j = 0; j < daysOffArray.length; j += 1) {
                            resObj.days.push(daysOffArray[j].format('dddd'))

                        }

                        const found = _.find(requestResult, {
                                'name': resObj.name
                            })
                            //if user found, add days to their object
                        if (found) {
                            found.days = found.days.concat(resObj.days)
                        }
                        //If user not found, push new user object into array
                        else {
                            requestResult.push(resObj)
                        }
                    }
                }
                //else if {}
            }
            if (requestResult.length > 0 && holiResult.length > 1) {

                bot.sendWebhook({
                    text: 'Week of ' + weekStart.format('MM/DD') + '-' + weekEnd.format('MM/DD') + '\n'+ 'Scheduled to be out:' + '\n' + formatArrayToString(requestResult) + '\n' + '🎉Company Holidays this week🎉: ' + '\n' + formatArrayToString(holiResult),
                    channel: process.env.SLACK_CHANNEL,
                    username: 'Scheduled to be out!',
                    icon_emoji: ':date:'
                }, function(err) {
                    if (err) {
                        console.log(err)
                    } else console.log('message sent!');
                });
            }

        })
    })
}


function formatArrayToString(array) {
  if (array.length < 1) {
    console.log('formatArray needs an array with a length greater than 0!')
    return
  }
  let resultArr = []
  for (let i = 0; i < array.length; i += 1) {
      let newArr = []
      newArr.push('>' + '*' + array[i].name + '*')
      newArr.push('_' + array[i].days.join(', ') + '_')
      newArr = newArr.join(': ')
      resultArr.push(newArr)
  }
  return resultArr.join('\n')
}

module.exports = whosOut
