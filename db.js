const homedir = require('os').homedir();
const home = process.env.HOME || homedir;
const path = require('path');
const dbPath = path.join(home, '.todo');
const fs = require('fs');

module.exports = {
    read: (path = dbPath) => {
        return new Promise((resolve, reject) => {
            fs.readFile(path, {flag: 'a+'}, (err, data) => {
                if (err) {
                    reject(err)
                    return;
                }
                let result
                try {
                    result = JSON.parse(data.toString())
                } catch (e) {
                    result = []
                }
                resolve(result)
            })
        })
    },
    write(list, path = dbPath) {
        return new Promise((resolve, reject) => {
            fs.writeFile(path, JSON.stringify(list), (err) => {
                if (err) {
                    reject(err);
                    return
                }
                resolve()
            })
        })
    },
}
