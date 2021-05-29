const inquirer = require('inquirer');
const exitValue = -1;
const addValue = -2;
const exitItem = {name: 'exit', value: exitValue}
const addItem = {name: '+ add a task', value: addValue}
const db = require('./db');

function setAsUndone(list, index) {
    list[index].done = false;
    db.write(list)
}

function setAsComplete(list, index) {
    list[index].done = true;
    db.write(list)
}

function updateTitle(list, index) {
    inquirer
        .prompt(
            {
                type: 'input',
                name: 'value',
                message: "title",
                default: list[index].title,
            })
        .then((answer) => {
            list[index].title = answer.value
            db.write(list)
        })
}

function deleteTask(list, index) {
    list.splice(index, 1)
    db.write(list)
}

const actions = {
    setAsUndone,
    setAsComplete,
    updateTitle,
    deleteTask
}

function askToAddTask(list) {
    inquirer
        .prompt(
            {
                type: 'input',
                name: 'value',
                message: "enter title",
            })
        .then((answer) => {
            list.push({title: answer.value, done: false})
            db.write(list)
        })
}

module.exports = {
    async add(taskName) {
        const list = await db.read()
        list.push({title: taskName, done: false})
        await db.write(list)
    },
    clear() {
        db.write([])
    },
    async showAll() {
        const list = await db.read();
        inquirer
            .prompt(
                {
                    type: 'list',
                    name: 'index',
                    message: 'Which task do you want to choose?',
                    choices: [exitItem, ...list.map((item, index) => ({
                        name: `${item.done ? '[x]' : '[_]'} ${item.title}`,
                        value: String(index)
                    }))].concat([addItem]),
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
                                value: 'deleteTask'
                            }
                        ]
                    })
                        .then(({operator}) => {
                            if (operator !== exitValue) {
                                const fn = actions[operator]
                                fn && fn(list, index)
                            }
                        })
                } else if (index === addValue) {
                    askToAddTask(list)
                }
            })
            .catch((error) => {
                if (error.isTtyError) {
                    // Prompt couldn't be rendered in the current environment
                } else {
                    // Something else went wrong
                }
            });
    },
}
