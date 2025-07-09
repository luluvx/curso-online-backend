const PDFDocument = require('pdfkit');

const crearPDFCertificado = async ({ usuario, curso, promedio, cursoId, usuarioId }) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));

    // Marco decorativo
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
        .lineWidth(4)
        .strokeColor('#2E86C1')
        .stroke();

    // Título
    doc.fontSize(30)
        .fillColor('#2E86C1')
        .font('Times-Bold')
        .text('Certificado de Finalización', { align: 'center', underline: true });

    doc.moveDown(2);

    // Texto principal
    doc.fontSize(18)
        .fillColor('black')
        .font('Times-Roman')
        .text(`Otorgado a`, { align: 'center' });

    doc.moveDown(0.5);

    // Nombre del estudiante destacado
    doc.fontSize(24)
        .fillColor('#117A65')
        .font('Times-Bold')
        .text(`${usuario.nombre} ${usuario.apellido}`, { align: 'center' });

    doc.moveDown(1);

    doc.fontSize(18)
        .fillColor('black')
        .font('Times-Roman')
        .text(`Por haber completado satisfactoriamente el curso`, { align: 'center' });

    doc.moveDown(0.5);

    // Nombre del curso destacado
    doc.fontSize(22)
        .fillColor('#B9770E')
        .font('Times-Bold')
        .text(`${curso.titulo}`, { align: 'center' });

    doc.moveDown(1);

    // Profesor y promedio
    doc.fontSize(16)
        .fillColor('black')
        .font('Times-Roman')
        .text(`Profesor: ${curso.profesor?.nombre || ''} ${curso.profesor?.apellido || ''}`, { align: 'center' })
        .moveDown(0.2)
        .text(`Promedio final: ${promedio.toFixed(2)}`, { align: 'center' });

    doc.moveDown(2);

    // Fecha y código
    doc.fontSize(14)
        .fillColor('gray')
        .text(`Fecha de emisión: ${new Date().toLocaleDateString()}`, { align: 'center' })
        .moveDown(0.2)
        .text(`ID de certificado: CUR-${cursoId}-USR-${usuarioId}`, { align: 'center' });

    // Línea de firma (opcional)
    doc.moveDown(3);
    doc.fontSize(16)
        .fillColor('black')
        .text('_________________________', { align: 'center' })
        .text('Firma del profesor', { align: 'center' });

    doc.end();

    return new Promise((resolve, reject) => {
        doc.on('end', () => {
            const pdfBuffer = Buffer.concat(buffers);
            resolve(pdfBuffer);
        });
        doc.on('error', reject);
    });
};

module.exports = { crearPDFCertificado }; 