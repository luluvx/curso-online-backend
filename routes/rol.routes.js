module.exports = app => {
    let router = require("express").Router();
    const controller = require("../controllers/rol.controller.js");



    // Create a new role
    //router.post("/", [authJwt.verifyToken, authJwt.isAdmin], controller.create);
    router.post("/", controller.create);

    // Retrieve all roles
    router.get("/",  controller.findAll);

    // Retrieve a single role with id
    router.get("/:id",  controller.findOne);

    // Update a role with id
    router.put("/:id",  controller.update);

    // Delete a role with id
    router.delete("/:id", controller.remove);

    app.use("/api/roles", router);
}