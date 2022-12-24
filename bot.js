const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
//var auth = require('./auth.json');
var roll = require('./roll.js')

// Initialize Discord Bot
var bot = new Client({ intents: [GatewayIntentBits.Guilds] });
bot.on('ready', () => {
  console.log('Connected');
  console.log('Logged in as: ' + bot.user.tag);
});

const DEFAULT_N = 6;

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

function pb_repeat(t, n, min, max) {
  var res = '';

  var i;
  for (i = 1; i <= t; i++) {
    res += "#" + i + ": " + pb_once(n, min, max) + "\n";
  }

  return res;
}

function pb_once(n, min, max) {

  // swap to not go into an endless cycle
  if (min > max){
    var tmp;
    tmp = min;
    min = max;
    max = tmp;
  }

  // send a pretty printed message.
  return (pretty_print_msg(roll_bounded(n, min, max)))

}

bot.on('interactionCreate', async (interaction) => {

  if (!interaction.isChatInputCommand()) return;

  const n = interaction.options.getInteger('number_of_abilities') ?? DEFAULT_N;
  // establish default boundaries in case not all are provided. Dummy values are dummy.
  const min = interaction.options.getInteger('min_accepted_cost') ?? n*(-99);
  const max = interaction.options.getInteger('max_accepted_cost') ?? n*99;

  if (interaction.commandName === 'pb') {
    if (interaction.options.getSubcommand() === 'repeat') {
      const t = interaction.options.getInteger('number_of_repeats');
      await interaction.reply(pb_repeat(t, n, min, max));
    } else {
      await interaction.reply(pb_once(n, min, max));
    }
  }

});

bot.login(process.env.BOT_TOKEN);
