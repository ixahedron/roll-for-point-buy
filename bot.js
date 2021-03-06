const Discord = require('discord.js');
require('dotenv').config();
//var auth = require('./auth.json');
var roll = require('./roll.js')

// Initialize Discord Bot
var bot = new Discord.Client();
bot.login(process.env.BOT_TOKEN);
bot.on('ready', () => {
    console.log('Connected');
    console.log('Logged in as: ' + bot.user);
});

const DEFAULT_N = 6;
const HELP_MESSAGE = "Use /pb to roll 4d6 drop lowest 6 times.\n\
\Specify three or less numbers to bound the roll, like this:\
\`/pb number_of_abilities min_accepted_cost max_accepted_cost`.\n\
\E.g. `/pb 6 24 30` is what I use for my games.\n\
\Another option is to repeat rolls with a syntax like this:\
\`/pb repeat number_of_times number_of_abilities min_accepted_cost max_accepted_cost`.\n\
\E.g. `/pb repeat 3` would roll for standard six abilities three times."

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

    if (args[0] == 'repeat') {
        if (isNaN(args[1])) {
            return HELP_MESSAGE
        } else {
          t = args[1];
          args.splice(0,2);

          res = '';

          var i;
          for (i = 1; i <= t; i++) {
            res += "#" + i + ": " + pb_once(Array.from(args)) + "\n";
          }

          return res;

        }
    } else { return pb_once(args) }
}

function pb_once(args) {
    
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


bot.on('message', (msg) => {

    // Listen for messages starting with /pb or /help
    if (msg.content.substring(0, 1) == '/') {

        var args = msg.content.substring(1).split(' ');
        var cmd = args[0];
        args = args.splice(1);
        
        switch(cmd) {
            case 'pb':
                msg.channel.send(process_pb(args));
                break;
            case 'pbi': // just for my own games since that's what I use
                msg.channel.send(pretty_print_msg(roll_bounded(6, 24, 30)));
                break;
            case 'pbhelp':
                msg.channel.send(HELP_MESSAGE);
                break;
            case 'help':
                msg.channel.send(HELP_MESSAGE);
                break;
        }

    }

});
