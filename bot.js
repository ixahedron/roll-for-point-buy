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

var DEFAULT_N = 6;
var HELP_MESSAGE = "Use /pb to roll 4d6 drop lowest 6 times.\nSpecify three or less numbers to bound the roll, like this: /pb number_of_abilities min_accepted_cost max_accepted_cost.\nE.g. '/pb 6 24 30' is what I use for my games."

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

function process_pb(args) {

                if (!args || !args.length) {
                    return pretty_print_msg(roll.roll(DEFAULT_N))
                }

                // check args are not NaN
                if (!isNaN(args[0])) {

                    msg = '';
                    
                    n = args[0];
                    if (n > 30) {
                        n = 30;
                        msg = 'Maximum amount of stats for one batch is arbitrarily set to 30. ';
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
                    return (msg + pretty_print_msg(roll_bounded(n, min, max)))
                } else {
                    return HELP_MESSAGE
                }

}


bot.on('message', function (user, userID, channelID, message, evt) {

    // Listen for messages starting with /pb or /help
    if (message.substring(0, 1) == '/') {

        var args = message.substring(1).split(' ');
        var cmd = args[0];
        args = args.splice(1);
        
        switch(cmd) {
            case 'pb':
                bot.sendMessage({
                    to: channelID,
                    message: process_pb(args)
                });
                break;
            case 'pbi': // just for my own games since that's what I use
                bot.sendMessage({
                    to: channelID,
                    message: pretty_print_msg(roll_bounded(6, 24, 30))
                });
                break;
            case 'pbhelp':
                bot.sendMessage({
                    to: channelID,
                    message: HELP_MESSAGE
                });
            case 'help':
                bot.sendMessage({
                    to: channelID,
                    message: HELP_MESSAGE
                });
        }

    }

});
