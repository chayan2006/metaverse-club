import jsPDF from 'jspdf';
import QRCode from 'qrcode';

interface TicketData {
    ticketId: string;
    eventName: string;
    attendeeName: string;
    teamName: string;
    role: string;
    date: string;
    venue: string;
}

export const generateTicketPDF = async (data: TicketData) => {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    // Brand Colors
    const neonBlue = '#00f3ff';
    const darkBg = '#0a0a0f';

    // Background
    doc.setFillColor(10, 10, 15); // Dark Cyber Background
    doc.rect(0, 0, 210, 297, 'F');

    // Header / Banner
    doc.setFillColor(0, 243, 255); // Neon Blue
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('METAVERSE CLUB', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.text('OFFICIAL EVENT TICKET', 105, 30, { align: 'center' });

    // Ticket Container
    doc.setDrawColor(0, 243, 255);
    doc.setLineWidth(1);
    doc.rect(20, 50, 170, 200);

    // Event Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(30);
    doc.text(data.eventName.toUpperCase(), 105, 80, { align: 'center' });

    // Details Section
    doc.setFontSize(14);
    doc.setTextColor(200, 200, 200);

    let y = 110;
    const leftX = 40;
    const rightX = 120;

    // Row 1
    doc.setFont('helvetica', 'normal');
    doc.text('ATTENDEE', leftX, y);
    doc.text('TEAM', rightX, y);
    y += 8;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 243, 255); // Neon Accent
    doc.text(data.attendeeName.toUpperCase(), leftX, y);
    doc.text(data.teamName.toUpperCase(), rightX, y);

    y += 20;

    // Row 2
    doc.setTextColor(200, 200, 200);
    doc.setFont('helvetica', 'normal');
    doc.text('ROLE', leftX, y);
    doc.text('TICKET ID', rightX, y);
    y += 8;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 243, 255);
    doc.text(data.role.toUpperCase(), leftX, y);
    doc.text(data.ticketId, rightX, y);

    y += 20;

    // Row 3 (Date & Venue)
    doc.setTextColor(200, 200, 200);
    doc.setFont('helvetica', 'normal');
    doc.text('DATE & TIME', leftX, y);
    doc.text('VENUE', rightX, y);
    y += 8;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(data.date, leftX, y);
    doc.text(data.venue, rightX, y); // Long text might need wrapping in real app

    // QR Code Section
    y += 40;
    try {
        const qrData = JSON.stringify({
            id: data.ticketId,
            name: data.attendeeName,
            event: data.eventName,
            valid: true
        });
        const qrDataUrl = await QRCode.toDataURL(qrData);
        doc.addImage(qrDataUrl, 'PNG', 75, y, 60, 60);
    } catch (err) {
        console.error('QR Gen Error', err);
        doc.rect(75, y, 60, 60); // Fallback box
        doc.text('QR CODE', 105, y + 30, { align: 'center' });
    }

    y += 70;
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('Present this ticket at the entrance.', 105, y, { align: 'center' });
    doc.text('This ticket is non-transferable.', 105, y + 5, { align: 'center' });

    // Save
    doc.save(`${data.eventName}_Ticket_${data.attendeeName}.pdf`);
};
