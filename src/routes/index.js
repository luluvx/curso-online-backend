module.exports = app => {
    require('@modules/usuario/auth.routes')(app);
    require('@modules/rol/rol.routes')(app);
    require('@modules/categoria/categoria.routes')(app);
    require('@modules/curso/curso.routes')(app);
    require('@modules/inscripcion/inscripcion.routes')(app);
    require('@modules/video/video.routes')(app);
    require('@modules/nota/nota.routes')(app);
    require('@modules/permiso/permiso.routes')(app);
    require('@modules/rol-permisos/rol-permisos.routes')(app);
    require('@modules/comentario/comentario.routes')(app);
};
