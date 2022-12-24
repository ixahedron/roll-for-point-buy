const { SlashCommandBuilder } = require('discord.js');

const pb_command = new SlashCommandBuilder()
  .setName('pb')
  .setDescription('Roll 4d6 drop lowest with the specified constraints.')
  .addSubcommand(subcommand =>
    subcommand.setName('once')
              .setDescription('Roll 4d6-drop-lowest with the specified constraints.')
              .addIntegerOption(option =>
      option.setName('number_of_abilities')
            .setDescription('number of abilities to roll, defaults to 6')
            .setMaxValue(30)
      )
            .addIntegerOption(option =>
      option.setName('min_accepted_cost')
            .setDescription('minimal accepted cost')
      )
            .addIntegerOption(option =>
      option.setName('max_accepted_cost')
            .setDescription('maximal accepted cost')
      )
  )
  .addSubcommand(subcommand =>
    subcommand.setName('repeat')
              .setDescription('Repeat the specified roll a number of times.')
              .addIntegerOption(option =>
      option.setName('number_of_repeats')
            .setDescription('number of times to repeat')
            .setRequired(true)
      )
              .addIntegerOption(option =>
      option.setName('number_of_abilities')
            .setDescription('number of abilities to roll, defaults to 6')
            .setMaxValue(30)
      )
            .addIntegerOption(option =>
      option.setName('min_accepted_cost')
            .setDescription('minimal accepted cost')
      )
            .addIntegerOption(option =>
      option.setName('max_accepted_cost')
            .setDescription('maximal accepted cost')
      )
  )

commands = [];
commands.push(pb_command.toJSON());

module.exports = {data: commands};
