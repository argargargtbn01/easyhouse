import { Room } from 'src/room/entities/room.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

@Entity('houses')
export class House {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: number;

  @Column({ length: 2048 })
  name: string;

  @Column({ length: 2048 })
  address: string;

  @Column()
  status: number;

  @Column('float')
  area: number;

  @Column('text')
  description: string;

  @Column({ length: 2048 })
  image: string;

  @ManyToOne(() => User, (user) => user.houses)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column()
  price: number;

  @Column()
  numOfRooms: number;

  @Column()
  numOfRoomsRented: number;

  @Column()
  numOfRoomsPosted: number;

  @Column()
  isPosted: number;

  @Column('bigint')
  createdTime: number;

  @OneToMany(() => Room, (room) => room.house)
  rooms: Room[];

  //   @OneToMany(() => Post, (post) => post.house)
  //   posts: Post[];
}
