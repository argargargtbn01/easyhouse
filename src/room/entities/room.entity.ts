import { House } from 'src/house/entities/house.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => House, (house) => house.rooms)
  @JoinColumn({ name: 'house_id' })
  house: House;

  @Column({ length: 2048 })
  name: string;

  @Column()
  price: number;

  @Column()
  status: number;

  @Column('float')
  area: number;

  @Column('text')
  description: string;

  @Column({ length: 2048 })
  image: string;

  @Column()
  isPosted: number;

  @Column('bigint')
  createdTime: number;
}
