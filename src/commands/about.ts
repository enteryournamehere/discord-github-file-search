import { Command } from "../utils/classes";
import constants from "../utils/constants";

export default new Command({
    name: 'about',
    description: 'show info about this bot',
    options: [],
    run: (interaction) => {
        interaction.reply({
            embeds: [{
                author: {
                    name: 'enteryournamehere',
                    icon_url: 'https://avatars.githubusercontent.com/u/11255568',
                    url: 'https://github.com/enteryournamehere'
                },
                title: 'Bot for searching files on GitHub',
                description: 'Usage: `/file <filename> [line number]`\n\nCode available (AGPL) on [GitHub](https://github.com/enteryournamehere/discord-github-file-search).',
                color: constants.colour_about,
            }],
        });
    }
});
