import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { UserRole } from './user-role.schema'

@Entity('tbl_role')
export class Role extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number

  @Column({type: 'varchar', length:767, unique: true})
  name: string

  @OneToMany(() => UserRole, (userRole) => userRole.role)
  userRoles: UserRole[]

  @Column()
  @CreateDateColumn()
  createdAt: Date

  @Column()
  @UpdateDateColumn()
  updatedAt: Date

  @Column()
  @DeleteDateColumn()
  deletedAt: Date
}
