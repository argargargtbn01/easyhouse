import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CustomerEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column()
  email: string;
  @Column()
  password: string;
  @Column()
  loginType: string;
  @Column()
  firstName: string;
  @Column()
  lastName: string;
  @Column({
    nullable: true,
  })
  address: string;
  @Column({
    nullable: true,
  })
  city: string;
  @Column({
    nullable: true,
  })
  state: string;
  @Column({
    nullable: true,
  })
  zip: string;

  @Column({
    nullable: true,
  })
  @Column({
    nullable: true,
  })
  phone: string;
}
