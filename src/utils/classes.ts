export class Command {
    name: string;
    description: string;
    options: CommandArgInfo[];
    run: Function;

    constructor(c: CommandInfo) {
        this.name = c.name;
        this.description = c.description;
        this.options = c.options;
        this.run = c.run;
    }
}

interface CommandInfo {
    name: string;
    description: string;
    options: CommandArgInfo[];
    run: Function;
}

interface CommandArgInfo {
    name: string;
    description: string;
    type: string;
    required: boolean;
}

export interface FoundFile {
    name: string;
    path: string;
    url: string;
    line?: number;
}

export interface SearchResults {
    results: FoundFile[];
}
