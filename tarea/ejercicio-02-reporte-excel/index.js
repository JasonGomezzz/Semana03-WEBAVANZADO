const http = require('http');
const { Readable } = require('stream');
const ExcelJS = require('exceljs');

const ventas = [
    { producto: 'Laptop', cantidad: 5, precio: 2500 },
    { producto: 'Monitor', cantidad: 8, precio: 850 },
    { producto: 'Teclado', cantidad: 15, precio: 120 },
    { producto: 'Mouse', cantidad: 20, precio: 75 },
    { producto: 'Impresora', cantidad: 4, precio: 680 },
    { producto: 'Audífonos', cantidad: 12, precio: 150 },
    { producto: 'Cámara web', cantidad: 7, precio: 210 },
    { producto: 'Micrófono', cantidad: 6, precio: 180 },
    { producto: 'Parlantes', cantidad: 9, precio: 240 },
    { producto: 'Memoria USB', cantidad: 25, precio: 45 },
    { producto: 'Disco SSD', cantidad: 10, precio: 320 },
    { producto: 'Disco duro', cantidad: 6, precio: 280 },
    { producto: 'Router', cantidad: 5, precio: 190 },
    { producto: 'Cable HDMI', cantidad: 30, precio: 35 },
    { producto: 'Adaptador USB', cantidad: 18, precio: 40 },
    { producto: 'Tableta gráfica', cantidad: 3, precio: 460 },
    { producto: 'Proyector', cantidad: 2, precio: 1800 },
    { producto: 'Silla ergonómica', cantidad: 4, precio: 720 },
    { producto: 'Escritorio', cantidad: 3, precio: 950 },
    { producto: 'Estabilizador', cantidad: 8, precio: 165 }
];

const server = http.createServer(async (req, res) => {
    if (req.url !== '/reporte') {
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Visita /reporte para descargar el Excel');
        return;
    }

    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Ventas');

        worksheet.columns = [
            { header: 'Producto', key: 'producto', width: 25 },
            { header: 'Cantidad', key: 'cantidad', width: 15 },
            { header: 'Precio', key: 'precio', width: 15 }
        ];

        worksheet.addRows(ventas);

        const buffer = await workbook.xlsx.writeBuffer();

        res.writeHead(200, {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename="reporte_ventas.xlsx"',
            'Content-Length': buffer.length
        });

        Readable.from([buffer]).pipe(res);
    } catch (error) {
        console.error('Error al generar el Excel:', error);

        if (!res.headersSent) {
            res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        }

        res.end('Error al generar el reporte');
    }
});

server.listen(3000, () => {
    console.log('Servidor ejecutándose en http://localhost:3000');
});
