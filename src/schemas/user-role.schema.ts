import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { User } from './user.schema'
import { Role } from './role.schema'

@Entity('tbl_user_role')
export class UserRole extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(
    () => User,
    (user) => user.userRoles,
    {nullable: false}
  )
  @JoinColumn({ name: 'user' })
  user: User

  @ManyToOne(
    () => Role,
    (role) => role.userRoles,
    {nullable: false}
  )
  @JoinColumn({ name: 'role' })
  role: Role

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
