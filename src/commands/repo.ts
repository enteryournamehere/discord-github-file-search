import { CommandInteraction, MessageEmbed } from "discord.js";
import { Command } from "../utils/classes";
import constants from "../utils/constants";
import db from "../utils/database";

export default new Command({
    name: 'repo',
    description: 'set repository to use for search',
    options: [{
        name: 'repository',
        description: 'user/repo or the full link',
        type: 'STRING',
        required: true,
    }],
    run: async (interaction: CommandInteraction) => {
        // Make sure valid repository name or URL was given
        // Regex will match the `user/repo` of a GitHub URL, or just only `user/repo`
        let input =  <string> interaction.options.get('repository').value;
        let matches = input.match(/(?:github.com\/)?(\w+\/\w+)/);
        if (!matches)
            return interaction.reply({embeds: [{
                description: `**${input}** doesn't look like a valid repository to me - please use either the full GitHub URL or \`username/repository\`.`,
                color: constants.colour_fail,
            }]});

        // Store repository for this guild in database
        await db.setRepo(interaction.guild.id, matches[1]);
        interaction.reply(`Repository set to **${matches[1]}**!`);
    }
});
