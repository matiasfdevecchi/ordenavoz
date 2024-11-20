import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { WebConfig, WebConfigId } from '../core/domain/WebConfig';

@Entity('web_configs')
export class TypeormWebConfig {
  @PrimaryGeneratedColumn()
  id: WebConfigId;
  
  @Column()
  backofficePrinterUrl: string;

  @Column()
  clientPrinterUrl: string;

  static from(wc: WebConfig): TypeormWebConfig {
    const o = new TypeormWebConfig();
    if (wc.id != 0) o.id = wc.id;
    o.backofficePrinterUrl = wc.backofficePrinterUrl;
    o.clientPrinterUrl = wc.clientPrinterUrl;
    return o;
  }

  toDomain(): WebConfig {
    return new WebConfig({
      id: this.id,
      backofficePrinterUrl: this.backofficePrinterUrl,
      clientPrinterUrl: this.clientPrinterUrl,
    });
  }
}
