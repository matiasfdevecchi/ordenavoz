export type WebConfigId = number;

export type WebConfigProps = {
  id: WebConfigId;
  backofficePrinterUrl: string;
  clientPrinterUrl: string;
}

export class WebConfig {
  readonly id: WebConfigId;
  readonly backofficePrinterUrl: string;
  readonly clientPrinterUrl: string;

  constructor({ id, backofficePrinterUrl, clientPrinterUrl }: WebConfigProps) {
    this.id = id;
    this.backofficePrinterUrl = backofficePrinterUrl;
    this.clientPrinterUrl = clientPrinterUrl;
  }

  static fromJson(json: WebConfigProps) {
    return new WebConfig(json);
  }

  static default(): WebConfig {
    return new WebConfig({
      id: 0,
      backofficePrinterUrl: '',
      clientPrinterUrl: '',
    });
  }
}