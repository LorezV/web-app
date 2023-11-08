const {exec} = require('child_process');

async function bootstrap() {
    await new Promise((resolve, reject) => {
        const migrate = exec("npx sequelize-cli db:migrate", { env: process.env }, err => (
            err ? reject(err) : resolve()
        ));

        migrate.stdout.pipe(process.stdout);
        migrate.stderr.pipe(process.stderr);
    });

    await new Promise((resolve, reject) => {
        const migrate = exec("npx sequelize-cli db:seed:all", { env: process.env }, err => (
            err ? reject(err) : resolve()
        ));

        migrate.stdout.pipe(process.stdout);
        migrate.stderr.pipe(process.stderr);
    });

    require("./src/index.js");
}

bootstrap();