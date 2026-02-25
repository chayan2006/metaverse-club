import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendRegistrationEmail = async (to, teamName, names, eventId) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: 'Registration Confirmed - Metaverse Club',
        html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h2 style="color: #00f0ff;">Welcome to Metaverse Club!</h2>
                <p>Hello,</p>
                <p>Your team <strong>${teamName}</strong> has been successfully registered.</p>
                <p><strong>Team Members:</strong> ${names.join(', ')}</p>
                <p><strong>Event ID:</strong> ${eventId}</p>
                <br/>
                <p>We look forward to seeing you at the event!</p>
                <p>Best regards,<br/>Metaverse Club Admin</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

export const sendJoinEmail = async (to, teamName, memberName) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: 'You have joined a team! - Metaverse Club',
        html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h2 style="color: #00f0ff;">Team Join Successful!</h2>
                <p>Hello ${memberName},</p>
                <p>You have successfully joined the team <strong>${teamName}</strong>.</p>
                <br/>
                <p>Good luck!</p>
                <p>Best regards,<br/>Metaverse Club Admin</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};
