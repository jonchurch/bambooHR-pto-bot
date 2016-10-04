# Bamboohr "Who's Out?" Slackbot
![bhr](https://cloud.githubusercontent.com/assets/12915163/17829398/4b948526-667b-11e6-8ba1-b6d429b4db20.jpg)

Slack bot to post in #work_schedules every Monday with who is scheduled to be out of the office this week
It looks at the current week (M-F) and sees if any scheduled time off overlaps. The people with time off, and the days they'll be gone, will be posted to Slack.

Uses the BambooHR time off API, botkit, lodash, and moment!

## Never bring a lunch to work for a friend who has left town again! lolz


# Setup
1. From within the bambooHR-whosOut directory, run
```
WEBHOOK=https://hooks.slack.com/services/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 &&
docker build -t whosout:latest -q . &&
docker run -d --env BAMBOOHR_SUBDOMAIN=paracosm --env SLACK_WEBHOOK=$WEBHOOK --name whosout --env BAMBOOHR_TOKEN=<YOUR TOKEN> whosout
```
2. The scheduler is now running, and will wait until 8am Mondays system time to post to #work_schedules chat in Slack
