import Mailgen from "mailgen";
import nodemailer from "nodemailer";
const mailGenrate = (userName, verificationLink) => {
    return {
        body: {
            name: 'John Appleseed',
            intro: 'Welcome to Mailgen! We\'re very excited to have you on board.',
            action: {
                instructions: 'To get started with Mailgen, please click here:',
                button: {
                    color: '#3b4841', // Optional action button color
                    text: 'Confirm your account',
                },
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    };
}
const forgotPasswordMail = (userName, passwordResetLink) => {
    return {
        body: {
            name: 'John Appleseed',
            intro: 'Welcome to Mailgen! We\'re very excited to have you on board.',
            action: {
                instructions: 'To reset your password, please click here:',
                button: {
                    color: '#3b4841', // Optional action button color
                    text: 'Reset your password',
                },
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    };
}

const emailVerificationMail = (userName, verificationLink) => {
    return {
        body: {
            name: userName || 'User',
            intro: 'Welcome! Please verify your email address to activate your account.',
            action: {
                instructions: 'To verify your account, please click the button below:',
                button: {
                    color: '#22BC66',
                    text: 'Verify your email',
                    link: verificationLink,
                },
            },
            outro: 'If you did not create an account, no further action is required.',
        }
    };
}

const sendEmail = async (options) => {
   const mailgenrator = new Mailgen( {
            theme: 'default',
            product: {
                name: "Task Mananger",
                
                link:"https://taskmanagelink.com",
            }
        } )
    

        const mailContent = mailgenrator.generatePlaintext(options.mailgencontent);
        const mailhtml = mailgenrator.generate(options.mailgencontent);
      const transporter =  nodemailer.createTransport({
            host: process.env.MAILTRAPS_SMPTS_HOST || process.env.MAILTRAP_HOST,
            port: Number(process.env.MAILTRAPS_SMPTS_PORT || process.env.MAILTRAPS_SMPTS_PORTS || 2525),
            secure: false,
            auth: {
                user: process.env.MAILTRAPS_SMPTS_USER || process.env.MAILTRAPS_SMPTS_USERS || process.env.MAILTRAPS_SMPTS_USERES,
                pass: process.env.MAILTRAPS_SMPTS_PASS,
            },
})
                     const mail ={
                        from: "mail.taskmanger@example.com",
                        to: options.email,
                        subject: options.subject,
                        text: mailContent,
                        html: mailhtml,
                     }
    try{
        await transporter.sendMail(mail);

    }
        catch(error){  
            console.error("Error sending email:", error);
        }             
}

export { 
  sendEmail, mailGenrate, forgotPasswordMail, emailVerificationMail 
};