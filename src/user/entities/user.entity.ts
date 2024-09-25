import { House } from 'src/house/entities/house.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  uid: string; // Firebase UID

  @Column({ length: 200 })
  name: string;

  @Column({ length: 20 })
  phoneNumber: string;

  @Column({ length: 2048, nullable: true })
  avatar: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column()
  gender: number;

  @Column({ length: 200, nullable: true })
  hometown: string;

  @Column({ length: 200, nullable: true })
  city: string;

  @Column({ length: 200, nullable: true })
  district: string;

  @Column({ length: 500, nullable: true })
  address: string;

  @Column({ length: 200, nullable: true })
  facebook: string;

  @Column({ length: 200, nullable: true })
  telegram: string;

  @Column()
  role: 'admin' | 'owner' | 'tenant';

  @OneToMany(() => House, (house) => house.owner)
  houses: House[];
}
