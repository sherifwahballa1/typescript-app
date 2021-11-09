import * as nodemailer from 'nodemailer';
import * as pug from 'pug';
import * as htmlToText from 'html-to-text';
import { google } from 'googleapis';

import { EmailInfo } from '../../interfaces/EmailInfo';
import keys from '../../config';
import Logger from '../../utils/Logger';


export default class Email {
  private to: string;
  private name: string;
  private code: string;
  private from: string = keys.User_Email;
  private OAuth2 = google.auth.OAuth2;
  private oauth2Client = new this.OAuth2(
    keys.CLIENT_ID,
    keys.CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  constructor(userInfo: EmailInfo) {
    this.to = userInfo.email;
    this.name = userInfo.name;
    this.code = userInfo.code;

    this.oauth2Client.setCredentials({
      refresh_token: keys.REFRESH_TOKEN
    });

  }

  private async newTransport(): Promise<nodemailer.Transporter> {
    const accessToken = await this.accessToken();

    let config: any = {
      host: 'smtp.gmail.com',
      service: "gmail",
      port: 465,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: keys.User_Email,
        accessToken,
        clientId: keys.CLIENT_ID,
        clientSecret: keys.CLIENT_SECRET,
        refreshToken: keys.REFRESH_TOKEN,
        expires: 1484314697598
      },
      tls: {
        rejectUnauthorized: false
      },
      logger: true,
      debug: false,
    };

    return nodemailer.createTransport(config);
  }

  private async accessToken(): Promise<string | any> {
    try {
      let access_token = await this.oauth2Client.getAccessToken();
      return access_token.token;
    } catch (error: any) {
      Logger.error(error.message);
      return error;
    }
  }

  // send the actual email
  async send(template: any, subject: string): Promise<void> {
    try {
      // 1) Render HTML based on pug template
      const html = pug.renderFile(`${__dirname}/../../views/email/${template}.pug`, {
        firstName: this.name,
        code: this.code,
        subject
      });

      // 2) Define email options
      const mailOptions = {
        from: this.from,
        to: this.to,
        subject,
        html,
        text: htmlToText.fromString(html)
      };

      // 3) Create a tranport and send email
      let transporter = await this.newTransport();
      await transporter.sendMail(mailOptions);

    } catch (error: any) {
      Logger.error(error.message)
    }
  }

  async sendWelcome(): Promise<void> {
    await this.send('welcome', 'Welcome to Arab Security Cyber Wargames Family!');
  }

  async sendPasswordReset(): Promise<void> {
    await this.send(
      'passwordReset',
      'Your Password reset code'
    );
  }
};
