import { AbstractAuditingEntity } from 'src/common/entities/abstract-auditing-entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User extends AbstractAuditingEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  uid: string;

  @Column()
  email: string;
}
