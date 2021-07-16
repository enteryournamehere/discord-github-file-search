import { CommandInteraction, MessageActionRow, MessageSelectMenu } from 'discord.js'
import { Command, FoundFile } from '../utils/classes'
import { store } from '../utils/cache'
import { fileResultMessage } from '../utils/embed';
import db from '../utils/database';
import constants from '../utils/constants';
const fetch = require('node-fetch');

export default new Command({
    name: 'file',
    description: 'find a file',
    options: [{
        name: 'name',
        type: 'STRING',
        description: 'name of the file',
        required: true,
    }, {
        name: 'line',
        type: 'INTEGER',
        description: 'line number',
        required: false,
    }],
    run: async (interaction: CommandInteraction) => {
        // Fetch configured repository from database
        const repo: string = await db.getRepo(interaction.guild.id);

        // Exit if repo is not configured
        if (!repo)
            return interaction.reply({
                embeds: [{
                    description: 'Please set the repository you want to use first using `/repo`!',
                    color: constants.colour_fail,
                }]
            });

        // Build request URL
        const endpoint = `https://api.github.com/search/code?q=`;
        const query = [
            `repo:${repo}`,
            `filename:${interaction.options.get('name').value}}`,
        ].join('+');

        // Fetch results from GitHub API
        fetch(endpoint + query).then(r => r.json()).then(r => {
            // Error will occur when respository is invalid; tell user (ephemeral message)
            if (r.errors)
                return interaction.reply({
                    embeds: [{
                        description: `This search failed; make sure the repository **${repo}** exists, or change the repository with \`/repo\`.`,
                        color: constants.colour_fail,
                    }],
                    ephemeral: true,
                });

            // No results: tell user (ephermeral message)
            if (r.total_count == 0) {
                interaction.reply({
                    embeds: [{
                        description: `No results for '${interaction.options.get('name').value}'`,
                        color: constants.colour_fail,
                    }],
                    ephemeral: true,
                });
            }
            // Single result: respond with found file
            else if (r.total_count == 1) {
                const foundFile: FoundFile = {
                    name: r.items[0].name,
                    path: r.items[0].path,
                    url: r.items[0].html_url,
                };
                if (interaction.options.has('line'))
                    foundFile.line = <number>interaction.options.get('line').value;

                interaction.reply(fileResultMessage(foundFile));
            }
            // Multiple results: show select menu with first 25 results
            else {
                const options = r.items.sort((a, b) => a.name.length - b.name.length).slice(0, 25).map(item => {
                    const foundFile: FoundFile = {
                        name: item.name,
                        path: item.path,
                        url: item.html_url,
                    };
                    if (interaction.options.has('line'))
                        foundFile.line = <number>interaction.options.get('line').value;
                    return foundFile;
                });
                const key = new Date().getTime().toString() + interaction.options.get('name');

                // Store options in cache
                store(key, {
                    results: options,
                });

                interaction.reply({
                    embeds: [{
                        description: 'Multiple files found, please select one:',
                    }],
                    components: [
                        new MessageActionRow({
                            components: [
                                new MessageSelectMenu({
                                    options: options.map((item, index) => {
                                        // Make options with as label the file name (max. 25 chars) and as 
                                        // description the path to the file w/o the filename itself (max 50 chars)
                                        const path = item.path.substr(0, item.path.lastIndexOf('/'));
                                        return {
                                            label: item.name.length <= 25 ? item.name : item.name.substr(0, 24) + '…',
                                            description: path.length <= 50 ? path : path.substr(0, 49) + '…',
                                            value: index.toString(),
                                        }
                                    }),
                                    customId: key,
                                }),
                            ],
                        }),
                    ],
                    ephemeral: false,
                });
            }
        });
    }
});
