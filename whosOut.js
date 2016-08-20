'use strict';
require('dotenv').config()
const request = require('request-promise-native')
const Botkit = require('botkit')
const parseXml = require('xml2js').parseString
const moment = require('moment')
require('moment-range')
const _ = require('lodash')

function whosOut() {
    const controller = Botkit.slackbot({
        debug: false
    })

    const bot = controller.spawn({
        incoming_webhook: {
            url: process.env.SLACK_WEBHOOK
        }
    })

    const options = {
        url: 'https://545bd8cff15256e49319d84abed36c6c0c7e44e4:x@api.bamboohr.com/api/gateway.php/indica/v1/time_off/whos_out'
    }
    request(options).then(function(xml) {
        parseXml(xml, function(err, result) {
            // console.log(result)
            const resultArr = []
            const weekStart = moment().startOf('isoweek')
            const weekEnd = moment().endOf('isoweek').subtract('2', 'days')
            const weekRange = moment.range(weekStart, weekEnd)
            for (let i = 0; i < result.calendar.item.length; i += 1) {
                const index = result.calendar.item[i]
                const startDate = moment(index.start[0])
                const endDate = moment(index.end[0])
                const requestRange = moment.range(startDate, endDate)
                const resObj = {
                    name: index.employee[0]._,
                    days: []
                }
                if (requestRange.overlaps(weekRange)) {
                    const daysOffArray = weekRange.intersect(requestRange).toArray('days')
                    for (let j = 0; j < daysOffArray.length; j += 1) {
                        resObj.days.push(daysOffArray[j].format('dddd'))

                    }

                    const found = _.find(resultArr, {
                            'name': resObj.name
                        })
                        //if user found
                    if (found) {
                        found.days = found.days.concat(resObj.days)
                    }
                    //If user not found
                    else {
                        resultArr.push(resObj)
                    }
                }
            }
            let formArr = []
            for (let i = 0; i < resultArr.length; i += 1) {
                const index = resultArr[i]
                let newArr = []
                newArr.push('>'+'*' + index.name + '*')
                newArr.push('_' + index.days.join(', ') + '_')
                newArr = newArr.join(': ')
                formArr.push(newArr)
            }
            formArr = formArr.join('\n')

            bot.sendWebhook({
                text: 'This week: '+ weekStart.format('MM/DD')+'-'+weekEnd.format('MM/DD') +'\n' + formArr,
                channel: '#general',
                username: 'Scheduled to be out!',
                icon_emoji: ':date:'
            }, function(err, res) {
                if (err) {
                    console.log(err)
                }
            });


        })
    })
}

module.exports = whosOut
