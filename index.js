const homedir = require('os').homedir();
const home = process.env.HOME || homedir;
const path = require('path');
const dbPath = path.join(home, '.todo');
const fs = require('fs');
const inquirer = require('inquirer');
const exitValue = -1;
const exitItem = {name: 'exit', value: exitValue}
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
    async write(taskName, path = dbPath) {
        const list = await this.read()
        const task = list.concat([{title: taskName, done: false}]);
        return new Promise((resolve, reject) => {
            fs.writeFile(path, JSON.stringify(task), (err) => {
                if (err) {
                    reject(err);
                    return
                }
                resolve()
            })
        })
    },
    async showAll() {
        const list = await this.read();
        inquirer
            .prompt(
                {
                    type: 'list',
                    name: 'index',
                    message: 'Which task do you want to choose?',
                    choices: [{name: 'exit', value: '-1'}, ...list.map((item, index) => ({
                        name: item.title,
                        value: String(index)
                    }))],
                })
            .then((answers) => {
                const index = Number(answers.index);
                if (index > exitValue) {
                    inquirer.prompt({
                        type: 'list',
                        name: 'operator',
                        message: 'What do you want to do?',
                        choices: [
                            exitItem,
                            {
                                name: 'set as undone',
                                value: 'setAsUndone',
                            },
                            {
                                name: 'set as complete',
                                value: 'setAsComplete',
                            },
                            {
                                name: 'update title',
                                value: 'updateTitle',
                            },
                            {
                                name: 'delete',
                                value: 'delete'
                            }
                        ]
                    })
                        .then(({operator}) => {
                            if (operator === exitValue) {

                            }
                        })
                }
            })
            .catch((error) => {
                if (error.isTtyError) {
                    // Prompt couldn't be rendered in the current environment
                } else {
                    // Something else went wrong
                }
            });
    }
}
