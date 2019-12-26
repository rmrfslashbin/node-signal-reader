const path = require("path");
const sqlite3 = require("@journeyapps/sqlcipher").verbose();
const fs = require("fs");


class DB {
    constructor(rootdir) {
        this.db = null;
        this.config = this.loadConfig(rootdir);
        this.open();
    }


    open() {
        this.db = new sqlite3.Database(this.config.dbFile);
        this.db.run("PRAGMA cipher_compatibility = 3");
        this.db.run(`PRAGMA key = "x'${this.config.key}'";`);
    }

    close() {
        this.db.close( () => {
            this.db = null;
        });

    }


    loadConfig(rootPath) {
        const dbFile = path.resolve(rootPath, "sql/db.sqlite");
        const configFile = path.resolve(rootPath, "config.json");
        const attachments = path.resolve(rootPath, "attachments.noindex");

        try {
            let res;

            res = fs.statSync(dbFile);
            if (! res.isFile()) {
                throw {code: "not a file", path: dbFile};
            }

            res = fs.statSync(configFile);
            if (! res.isFile()) {
                throw {code: "not a file", path: configFile};
            }

            const config = JSON.parse(fs.readFileSync(require.resolve(configFile)));

            return {dbFile: dbFile, configFile: configFile, key: config.key, attachements: attachments};


        } catch (e) {
            throw new Error(`FATAL ERROR: "${e.code}" for path (${e.path})`);
        }
    }


    schemas() {
        return new Promise ( (resolve, reject) => {
            this.db.all("select name, sql from sqlite_master where type='table'", (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }


    schema(name) {
        return new Promise ( (resolve, reject) => {
            this.db.get(`select name, sql from sqlite_master where type='table' AND name='${name}'`, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }


    tables() {
        return new Promise ( (resolve, reject) => {
            this.db.all("select name from sqlite_master where type='table'", (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }


    conversations() {
        return new Promise ( (resolve, reject) => {
            this.db.all("SELECT * FROM conversations", (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }


    messagesFromConversation(conversationId, onlyWithAttachments = false) {
        return new Promise ( (resolve, reject) => {
            let sql;
            if (onlyWithAttachments) {
            sql = `SELECT messages.*, conversations.name, conversations.profileName FROM messages JOIN conversations ON messages.conversationId = conversations.id  WHERE messages.hasAttachments != 0 AND messages.conversationId = '${conversationId}' ORDER BY messages.sent_at`;
            } else {
                sql = `SELECT messages.*, conversations.name, conversations.profileName FROM messages JOIN conversations ON messages.conversationId = conversations.id  WHERE messages.conversationId = '${conversationId}' ORDER BY messages.sent_at`;
            }
            this.db.all(sql, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    message(messageId) {
        return new Promise ( (resolve, reject) => {
           let sql = `SELECT messages.*, conversations.name, conversations.profileName FROM messages JOIN conversations ON messages.conversationId = conversations.id  WHERE messages.id = '${messageId}'`;
            this.db.get(sql, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

}

module.exports = DB;

