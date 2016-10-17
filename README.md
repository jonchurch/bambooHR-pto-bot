# Bamboohr "Who's Out?" Slackbot
![bhr](https://cloud.githubusercontent.com/assets/12915163/17829398/4b948526-667b-11e6-8ba1-b6d429b4db20.jpg)

Slack bot to post in a slack channe every Monday with who is scheduled to be out of the office this week. It will post to the slack channel you specify as default when setting up a custom integration.
The bot looks at the current week (M-F) and sees if any scheduled time off overlaps. The people with time off, and the days they'll be gone, will be posted to Slack.

Uses the BambooHR time off API, botkit, lodash.find, and moment!

## Never bring a lunch to work for a friend who has left town again! lolz


# Setup

1. Generate Slack custom integration webhook [here](https://slack.com/apps/manage/custom-integrations) and choose the channel you would like WhosOut to post to. Create a BambooHR api token within your account, and note the subdomain associated with your BambooHR organization.

1. From within the bambooHR-whosOut directory, run
```
docker build -t whosout:latest -q . &&
docker run -d --env BAMBOOHR_SUBDOMAIN=<YOUR TEAM> --env SLACK_WEBHOOK=<YOUR WEBHOOK> --name whosout --env BAMBOOHR_TOKEN=<YOUR TOKEN> whosout
```
2. The scheduler is now running, and will wait until 8am Mondays system time to post to the channel you setup the custom integration to default to.
