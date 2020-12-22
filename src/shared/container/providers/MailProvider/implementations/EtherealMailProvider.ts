import ImailProvider from "../models/IMailProvider";
import nodemailer, { Transporter } from 'nodemailer';
import ISendMailDTO from "../dtos/ISendMailDTO";
import IMailTemplateProvider from "../../MailTemplateProvider/models/IMailTemplateProvider";
import { inject, injectable } from "tsyringe";
import { template } from "handlebars";

@injectable()
export default class FakeMailProvider implements ImailProvider {
  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {
    nodemailer.createTestAccount().then(account => {
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure, // true for 465, false for other ports
        auth: {
          user: account.user, // generated ethereal user
          pass: account.pass, // generated ethereal password
        },
      });

      this.client = transporter;
    });
  }

  public async sendMail({ to, subject, from, templateData }: ISendMailDTO): Promise<void> {
   const message = await this.client.sendMail({
      from: {
        name: from?.name || 'Equipe GoBarber',
        address: from?.email || 'equipe@gobarber.com.br'
      },
      to: {
        name: to.name,
        address: to.email
      },
      subject: subject,
      html: await this.mailTemplateProvider.parse(templateData),
    })

    console.log(nodemailer.getTestMessageUrl(message))
  }
}
