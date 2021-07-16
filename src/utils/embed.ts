import { FoundFile } from './classes';
import constants from './constants';

export function fileResultMessage(item: FoundFile) {
    // Include line number if specified
    let after = '';
    if (item.line != undefined) {
        const line = item.line;
        item.url += '#L' + line;
        after = ` (line ${line})`;
    }

    let description = `[${item.path}](${item.url})${after}`;

    return {
        embeds: [{
            description: description,
            color: constants.colour_success,
        }],
        // Empty components array to remove the select menu when applicable
        components: [],
    }
}
