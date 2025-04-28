import {EventEmitter} from 'node:events';
import { nanoid , customAlphabet } from 'nanoid';
import { generateHash } from 'src/commen/security/hash.security';
import { verifyEmailTemplate, subjectTypes , sendEmail} from 'src/commen/email/sendEmail';
import { Injectable } from '@nestjs/common';



// ارجعى تانى ظبطي الكود وفكرى عدل  وابقى شوفى (event emitter to NestJS)


export const emailEvent = new EventEmitter();


@Injectable()
export class SendEmailService {
    generateRandomCode() {
        return Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
    }

    sentCode = async (data: any, subject = subjectTypes.confirmEmail, otp?: number) => {
        const { id, email, password } = data;

        const generatedOtp = otp || this.generateRandomCode();
        const html = verifyEmailTemplate(generatedOtp, email);
        const hash = generateHash(generatedOtp.toString());

        const otpExpiresAt = new Date(Date.now() + 2 * 60 * 1000);

        let dataUpdate = {};

        switch (subject) {
            case subjectTypes.confirmEmail:
                dataUpdate = { emailOTP: hash, otpExpiresAt };
                break;
            case subjectTypes.forgotPassword:
                dataUpdate = { passwordOTP: hash, otpExpiresAt };
                break;
            case subjectTypes.updateEmail:
                dataUpdate = { emailOTP: hash, otpExpiresAt };
                break;
        }
        await sendEmail({ to: email, subject, html });
    };
}
const sendEmailService = new SendEmailService();

emailEvent.on("sendConfirmEmail", async (data) => {
    await sendEmailService.sentCode(data, subjectTypes.confirmEmail);
});

emailEvent.on("sendCodeOTP", async (data) => {
    await sendEmailService.sentCode(data, subjectTypes.forgotPassword);
});

emailEvent.on("sendUpdateEmail", async (data) => {
    await sendEmailService.sentCode(data, subjectTypes.updateEmail);
});