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

  static NEW_ID = 0;

  static new(props: Omit<WebConfigProps, 'id'>): WebConfig {
    return new WebConfig({
      ...props,
      id: this.NEW_ID,
    });
  }

  static default(): WebConfig {
    return new WebConfig({
      id: this.NEW_ID,
      backofficePrinterUrl: '',
      clientPrinterUrl: '',
    });
  }

  copy(props: Partial<WebConfigProps>): WebConfig {
    return new WebConfig({
      ...this,
      ...props,
    });
  }
}