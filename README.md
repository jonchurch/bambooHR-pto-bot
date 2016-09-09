# Bamboohr "Who's Out?" Slackbot
![bhr](https://cloud.githubusercontent.com/assets/12915163/17829398/4b948526-667b-11e6-8ba1-b6d429b4db20.jpg)

Slack bot to post in #general every Monday with who is scheduled to be out of the office this week
It looks at the current week (M-F) and sees if any scheduled time off overlaps. The people with time off, and the days they'll be gone, will be posted to slack.

Uses the bamboohr time off api, botkit, lodash, and moment!

##Never bring a lunch to work for a friend who has left town again!


#Setup
1. Create a .env file from the .env-example
2. Generate a Bamboohr API token from an admin account, set it to BAMBOOHR_TOKEN in your .env file
3. Set your team's subdomain for Bamboohr (EX. 'paracosm') to BAMBOOHR_SUBDOMAIN in .env file
3. Go to slack integrations, create a custom incoming webhook, update the SLACK_WEBHOOK .env field with supplied webhook

#Run
```
npm install

npm start
```

The scheduler is now running, and will wait until 8am system time to post to general chat in slack.
