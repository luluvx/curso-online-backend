module.exports = app => {
    require("./auth.routes")(app);
    require("./rol.routes")(app);
    require("./categoria.routes")(app);
    require("./curso.routes")(app);
    require("./inscripcion.routes")(app);
}