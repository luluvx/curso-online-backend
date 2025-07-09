module.exports = app => {
    require('@modules/auth/auth.routes')(app);
    require('@modules/rol/rol.routes')(app);
    require('@modules/categoria/categoria.routes')(app);
    require('@modules/curso/curso.routes')(app);
    require('@modules/inscripcion/inscripcion.routes')(app);
    require('@modules/video/video.routes')(app);
    require('@modules/nota/nota.routes')(app);
    require('@modules/tipo-nota/tipo-nota.routes')(app);
    require('@modules/permiso/permiso.routes')(app);
    require('@modules/rol-permisos/rol-permisos.routes')(app);
    require('@modules/comentario/comentario.routes')(app);
    require('@modules/progreso/progreso.routes')(app);
    require('@modules/usuario/usuario.routes')(app);
    require('@modules/certificado/certificado.routes')(app);
};
