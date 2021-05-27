const {program} = require('commander');
const api = require('./index')
program
    .command('add <taskName>')
    .description('add a task')
    .action((taskName) => {
        api.write(taskName)
    });

program.parse();
