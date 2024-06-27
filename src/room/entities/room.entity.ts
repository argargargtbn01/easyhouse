import { AbstractAuditingEntity } from 'src/common/entities/abstract-auditing-entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { StatusEnum } from '../../common/types/status.enum';
import { House } from 'src/house/entities/house.entity';

@Entity()
export class Room extends AbstractAuditingEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => House, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({
    referencedColumnName: 'id',
    name: 'house_id',
  })
  house: House;

  @Column()
  name: string;

  @Column({ nullable: true })
  status: StatusEnum;

  @Column({ nullable: true })
  area: number;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  price: number;
}
