import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class AbstractAuditingEntity {
  @CreateDateColumn({
    name: 'creation_date',
  })
  creationDate: Date;

  @UpdateDateColumn({
    name: 'last_modification_date',
  })
  lastModificationDate: Date;
}
