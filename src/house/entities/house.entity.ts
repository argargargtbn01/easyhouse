import { AbstractAuditingEntity } from 'src/common/entities/abstract-auditing-entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { HouseTypeEnum } from '../types/house-type.enum';
import { StatusEnum } from '../../common/types/status.enum';
import { IsPostedEnum } from '../../common/types/is-posted.enum';

@Entity()
export class House extends AbstractAuditingEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({
    referencedColumnName: 'id',
    name: 'owner_id',
  })
  owner: User;

  @Column()
  type: HouseTypeEnum;

  @Column()
  name: string;

  @Column({ nullable: true })
  address: string;

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

  @Column({ nullable: true })
  num_of_rooms: number;

  @Column({ nullable: true })
  num_of_rooms_rented: number;

  @Column({ nullable: true })
  num_of_rooms_posted: IsPostedEnum;
}
