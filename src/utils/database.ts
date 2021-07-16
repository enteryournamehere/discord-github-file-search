const sqlite3 = require('sqlite3').verbose();

class Database {
    db;

    constructor() {
        this.db = new sqlite3.Database(__dirname + '/../../db.sqlite', (e) => {
            if (e) console.error(e.message);
            console.log('Connected to database');
            this.createTables();
        });
    }

    createTables() {
        this.db.run('create table if not exists repo (guild VARCHAR(25), repo TEXT)', (e) => {if (e) console.error(e.message)});
    }

    getRepo(guild: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this.db.get('select repo from repo where guild = ?', [guild], (e, row) => {
                if (e) reject(e.message);
                if (row) resolve(row.repo);
                else resolve(undefined);
            });
        });
    }

    setRepo(guild: string, repo: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (await this.getRepo(guild)) {
                this.db.run('update repo set repo = ? where guild = ?', [repo, guild], (e) => {
                    if (e) reject(e.message);
                    resolve(true);
                });
            }
            else {
                this.db.run('insert into repo (repo, guild) values (?, ?)', [repo, guild], (e) => {
                    if (e) reject(e.message);
                    resolve(true);
                });
            }
        });
    }
}

export default new Database();
