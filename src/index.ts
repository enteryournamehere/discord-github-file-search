import { CommandInteraction, SelectMenuInteraction } from 'discord.js';
import * as commands from './commands/';
import { fileResultMessage } from './utils/embed';
import { forget, retrieve } from './utils/cache';
const config = require('../config.json');

const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);

    // Update commands in  testing guilds
    for (var guild in config.immediate_update_guilds) {
        client.guilds.cache.get(guild)?.commands
            .set(Object.values(commands))
    }

    // Update global commands (may take up to 1 hour to update everywhere)
    client.application?.commands.set(Object.values(commands));
});

client.on('interactionCreate', interaction => {
    // Handle slash commands
	if (interaction.isCommand()) handleCommand(interaction);

    // Handle select menu responses
    else if (interaction.isSelectMenu()) handleSelectMenu(interaction);
});

client.login(config.token);

function handleCommand(interaction: CommandInteraction) {
    // Find command
    const command = Object.values(commands).find(command => command.name == interaction.commandName);

    // Make sure command exists
    if (!command)
        interaction.reply({
            content: 'Sorry, this command is currently unavailable.',
            ephemeral: true,
        });

    command.run(interaction);
}

function handleSelectMenu(interaction: SelectMenuInteraction) {
    // Find search results linked to this select menu
    const cacheEntry = retrieve(interaction.customId);

    // Make sure results are still available (will disappear after bot restart)
    if (!cacheEntry)
        return interaction.reply({
            content: 'This result isn\'t available anymore, please run the command again.',
            ephemeral: true,
        });

    // Edit message to remove select menu and include result
    const found = cacheEntry.results[parseInt(interaction.values[0])];
    interaction.update(fileResultMessage(found));

    // Remove results from memory
    forget(interaction.customId);
}
