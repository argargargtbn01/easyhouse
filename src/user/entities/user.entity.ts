import { AbstractAuditingEntity } from 'src/common/entities/abstract-auditing-entity';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class User extends AbstractAuditingEntity {
  @PrimaryColumn()
  uid: string;

  @Column()
  email: string;
}
