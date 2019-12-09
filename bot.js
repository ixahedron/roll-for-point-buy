var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var roll = require('./roll.js')
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Listen for messages starting with /pb or /help
    if (message.substring(0, 3) == '/pb') {
      //m = "Rolling 4d6 drop lowest: ";
      bot.sendMessage({
          to: channelID,
          message: roll.roll(6)
      });
    }
    else if (message.substring(0, 5) == '/help') {
      bot.sendMessage({
          to: channelID,
          message: "Use /pb to roll 4d6 drop lowest 6 times."
      });
    
    }
});
