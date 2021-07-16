## Description
Discord bot to easily link to files on GitHub

## Installation
```
git clone https://github.com/enteryournamehere/discord-github-file-search
cd discord-github-file-search
npm install
npx tsc --build
```
Edit `config.json`; add your discord bot token and configure which guilds should have their commands immediately update when restarting the bot (for other guilds it may take up to 1 hour).
Then run the bot:
```
node .
```

## Usage
1. Set repository to use in your Discord server: `/repo <user/repo>` or `/repo <GitHub url>`
2. Find a file, optionally specify line number: `/file <filename> [line number]`