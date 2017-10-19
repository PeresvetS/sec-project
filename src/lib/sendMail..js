import nodemailer from 'nodemailer';


export default (message) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASS,
        }
    });


    const mailOptions = {
        from: '"no-reply" <niks280593@gmail.com>',
        to: 'nik.writter@yandex.ru',
        subject: 'New message',
        html: message,
    };


    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        return console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
};