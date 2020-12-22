import ISendMailDTO from "../dtos/ISendMailDTO";

export default interface ImailProvider {
  sendMail(data: ISendMailDTO): Promise<void>;
}
