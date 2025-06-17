module.exports = app => {
    require("./auth.routes")(app);
    require("./rol.routes")(app);
}