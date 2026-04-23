import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateReceipt = (sale: any) => {
  const doc = new jsPDF();

  // 1. Título de tu Empresa
  doc.setFontSize(22);
  doc.setTextColor(79, 70, 229); // Color Indigo 600
  doc.text('NEXUS ERP', 14, 22);

  // 2. Subtítulo e Información
  doc.setFontSize(14);
  doc.setTextColor(30, 41, 59); // Slate 800
  doc.text('Comprobante de Venta', 14, 32);

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // Slate 500
  doc.text(`ID Transacción: ${sale.id}`, 14, 42);
  doc.text(`Cliente: ${sale.customerName || 'Público General'}`, 14, 48);
  doc.text(`Fecha: ${new Date(sale.createdAt).toLocaleString()}`, 14, 54);

  // 3. Tabla con el detalle de la venta
  autoTable(doc, {
    startY: 60,
    head: [['Producto', 'Cantidad', 'Total']],
    body: [
      [sale.productName, `${sale.quantity} uds`, `$${sale.total.toFixed(2)}`]
    ],
    theme: 'grid',
    headStyles: { fillColor: [79, 70, 229] },
    styles: { fontSize: 11, cellPadding: 5 }
  });

  // 4. Mensaje de agradecimiento
  const finalY = (doc as any).lastAutoTable.finalY || 60;
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text('¡Gracias por su preferencia!', 14, finalY + 15);

  // 5. Generar y descargar el PDF
  doc.save(`Recibo-${sale.id.substring(0, 8)}.pdf`);
};
