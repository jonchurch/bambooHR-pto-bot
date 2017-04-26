'use strict';
const request = require('request-promise-native')
const parseXml = require('xml2js').parseString
const moment = require('moment')
require('moment-range')
require('moment-timezone')
const find = require('lodash.find')

var opts = {
    team: 'testbed',
    apiKey: process.env.apiKey,
    tz: 'America/New_York'
}
whosOut(opts)

function whosOut(config) {
    const date = new Date()
    console.log('Whos out running\nCurrent time is: ' + date.getHours() + ':' + date.getMinutes())

    const options = {
        url: `https://api.bamboohr.com/api/gateway.php/${config.team}/v1/time_off/whos_out/`,
        auth: {
            user: config.apiKey,
            pass: 'x'
        },
        qs: {
            start: moment().tz(config.tz).format('YYYY-MM-DD')
       //     end: 'END?'
        }
    }



    request(options).then(function(xml) {
        parseXml(xml, function(err, result) {
            if (err) {
                console.log('XML PARSE ERROR:', err)
                return
            }
             console.log('=============RESULT\n', result)

            const responseArray = []

            for (let j = 0; j < 2; j += 1) {
                var thisNext = 'This'
                const requestResult = []
                const holiResult = []
                    //Setting week start to Monday
                const weekStart = moment().startOf('isoweek')

                //Setting week end to Friday
                const weekEnd = moment().endOf('isoweek').subtract('2', 'days')

                if (j === 1) {
                    //adjust for second week
                    weekStart.add('1', 'weeks')
                    weekEnd.add('1', 'weeks')
                    thisNext = 'Next'
                }
                const weekRange = moment.range(weekStart, weekEnd)

                for (let i = 0; i < result.calendar.item.length; i += 1) {
                    // console.log('LOOPING', result.calendar.item);
                    const index = result.calendar.item[i]
                    const startDate = moment(index.start[0])
                    const endDate = moment(index.end[0])
                    const entryRange = moment.range(startDate, endDate)

                    if (index.$.type === 'holiday') {
                        // console.log('Found a holiday, somewhere, at index:', index);

                        const holidayObj = {
                            name: index.holiday[0]._,
                            days: []
                        }

                        const holiRangeArray = moment.range(startDate, endDate).toArray('days')

                        if (entryRange.overlaps(weekRange)) {
                            // console.log('Holiday overlaps with week!');

                            for (var k = 0; k < holiRangeArray.length; k += 1) {
                                holidayObj.days.push(holiRangeArray[k].format('MM/DD'))
                            }
                            holiResult.push(holidayObj)
                            continue
                        }
                    } else {
                        // console.log('This index is not a holiday. Index:', index);

                        const resObj = {
                            name: index.employee[0]._,
                            days: []
                        }

                        if (entryRange.overlaps(weekRange)) {
                            // console.log('This non-holiday entry overlaps with this week!');

                            const daysOffArrayThisWeek = weekRange.intersect(entryRange).toArray('days')
                            for (let j = 0; j < daysOffArrayThisWeek.length; j += 1) {

                                resObj.days.push(daysOffArrayThisWeek[j].format('dddd'))
                            }

                            const found = find(requestResult, {
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
                } // end calendar for loop

                if (requestResult.length > 0 && holiResult.length > 0) {
                    // console.log('Requests and holdays!');

                    responseArray.push('_' + thisNext + ' week_' + '\n' + formatArrayToString(requestResult) + '\n' + '🎉Company Holidays this week🎉:\n' + formatArrayToString(holiResult))

                } else if (requestResult.length > 0 && holiResult.length < 1) {
                    // console.log('Requests and no holdays!');

                    responseArray.push('_' + thisNext + ' week_' + '\n' + formatArrayToString(requestResult))

                } else if (requestResult.length < 1 && holiResult.length > 0) {
                    // console.log('No requests and some holdays!');

                    responseArray.push('_' + thisNext + ' week_' + '\n' + 'Nobody scheduled to be out ' + thisNext.toLowerCase() + '  week\n' + '🎉 Company Holidays ' + thisNext.toLowerCase() + ' week 🎉' + formatArrayToString(holiResult))

                } else if (requestResult.length < 1 && holiResult.length < 1) {
                    // console.log('No requests and no holdays!');

                    responseArray.push('_' + thisNext + ' week_' + '\n' + 'Nobody scheduled to be out ' + thisNext.toLowerCase() + '  week')
                }

            } // end week for loop

            // bot.sendWebhook({
            //     text: 'Scheduled to be out:\n' + responseArray.join('\n\n'),
            //     username: 'Who\'s Out?',
            //     icon_emoji: ':date:'
            // }, function(err) {
            //     if (err) {
            //         console.log(err)
            //     } else console.log('message sent!');
            // });


            console.log('RESPONSE ARRAY:\n', responseArray)

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

//
// bot.sendWebhook({
//     text: 'Week of ' + weekStart.format('MM/DD') + '-' + weekEnd.format('MM/DD') + '\n' + 'Scheduled to be out:\n' + formatArrayToString(requestResult),
//     channel: process.env.SLACK_CHANNEL,
//     username: 'Who\'s Out?',
//     icon_emoji: ':date:'
// }, function(err) {
//     if (err) {
//         console.log(err)
//     } else console.log('message sent!');
// })
