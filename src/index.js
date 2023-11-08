const express = require("express");
const db = require("./database/index.js");
const UserController = require("./controllers/user.controller.js");

function main() {
    const dependencies = {
        db
    }

    const controllers = {
        user: UserController(dependencies)
    }

    const app = express();
    app.use(express.json());
    app.use("/api", createApiRouter(controllers));
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}

function createApiRouter(controllers) {
    const router = express.Router();

    router.put("/user/balance/:userId", controllers.user.updateBalance.bind(controllers.user));

    return router;
}

main();