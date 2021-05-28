const {program} = require('commander');
const api = require('./index')
program
    .command('add <taskName>')
    .description('add a task')
    .action((taskName) => {
        api.add(taskName).then(() => {
            console.log('success');
        })
    });

program
    .command('clear')
    .description('clear tasks')
    .action(() => {
        api.clear();
    });

if (process.argv.length === 2) {
    api.showAll()
        .then(() => {})
    return;
}

program.parse();
