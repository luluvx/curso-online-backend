const certificadoService = require('./certificado.service');

exports.descargarCertificado = async (req, res, next) => {
    try {
        const usuarioId = req.user.id;
        const cursoId = req.params.cursoId;
        const pdfBuffer = await certificadoService.generarCertificado(usuarioId, cursoId);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=certificado.pdf');
        res.send(pdfBuffer);
    } catch (error) {
        next(error);
    }
}; 