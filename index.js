const homedir = require('os').homedir();
const home = process.env.HOME || homedir;
const path = require('path');
const dbPath = path.join(home, '.todo');
const fs = require('fs');
module.exports = {
    read: (path = dbPath) => {
        console.log(dbPath);
        fs.readFile(dbPath, {flag: 'a+'}, (err, data) => {
            if (err) {
                return;
            }
            let result
            try {
                result = JSON.parse(data.toString())
            } catch (e) {
                result = []
            }
        })
    },
    write(taskName, path = dbPath) {
        const task = [{title: taskName, done: false}];
        fs.writeFile(path, JSON.stringify(task),(err) => {
            if(err){
                console.log(err);
                return
            }
            console.log('write success');
        })
    }
}
