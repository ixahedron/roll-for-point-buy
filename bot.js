var Discord = require('discord.io');
//var auth = require('./auth.json');
var roll = require('./roll.js')

// Initialize Discord Bot
var bot = new Discord.Client({
//    token: auth.token,
    token: process.env.BOT_TOKEN,
    autorun: true
});
bot.on('ready', function (evt) {
    console.log('Connected');
    console.log('Logged in as: ');
    console.log(bot.username + ' - (' + bot.id + ')');
    console.log('Running in: ' + Object.keys(bot.servers).length + ' server(s).');
});


// continue to reroll until the result is within provided boundaries
function roll_bounded(n, min, max) {
    
    do {
      roll_result = roll.roll(n);
    } while ((roll_result.pb_sum < min) || (roll_result.pb_sum > max));

    return roll_result;

}

function pretty_print_msg(roll_obj) {
    return roll_obj.stats + '. Point buy value: ' + roll_obj.pb_sum;
}

bot.on('message', function (user, userID, channelID, message, evt) {

    // Listen for messages starting with /pb or /help
    if (message.substring(0, 1) == '/') {

        var args = message.substring(1).split(' ');
        var cmd = args[0];
        args = args.splice(1);
        
        switch(cmd) {
            case 'pb':

                var n = 6;
                
                if (!args) {

                    bot.sendMessage({
                        to: channelID,
                        message: pretty_print_msg(roll.roll(n))
                    });
                    break;

                }

                // check args are not NaN
                if (!isNaN(args[0])) {
                    n = args[0];
                    if (n > 30) {
                        n = 30;
                    }
                }
                args.splice(0,1);
                
                // establish default boundaries incase not all are provided. Dummy values are dummy.
                var min = n*(-99);
                var max = n*99;

                if (!isNaN(args[0])) {
                    min = args[0];
                }
                args.splice(0,1);
                if (!isNaN(args[0])) {
                    max = args[0];
                }

                // swap to not go into an endless cycle
                if (min > max){
                    var tmp;
                    tmp = min;
                    min = max;
                    max = tmp;
                }

                // send a pretty printed message.
                bot.sendMessage({
                    to: channelID,
                    message: pretty_print_msg(roll_bounded(n, min, max))
                });
                break;
            case 'pbi': // just for my own games since that's what I use
                bot.sendMessage({
                    to: channelID,
                    message: pretty_print_msg(roll_bounded(6, 24, 40))
                });
                break;
            case 'help':
                bot.sendMessage({
                    to: channelID,
                    message: "Use /pb to roll 4d6 drop lowest 6 times.\nSpecify three or less numbers to bound the roll, like this: /pb number_of_abilities min_accepted_cost max_accepted_cost.\nE.g. '/pb 6 24 40' is what I use for my game."
                });
        }

    }

});
