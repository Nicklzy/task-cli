const {program} = require('commander');
const api = require('./index')
program
    .command('add <taskName>')
    .description('add a task')
    .action((taskName) => {
        api.write(taskName).then(() => {
            console.log('success');
        })
    });

if (process.argv.length === 2) {
    api.showAll()
        .then(() => {})
    return;
}

program.parse();
