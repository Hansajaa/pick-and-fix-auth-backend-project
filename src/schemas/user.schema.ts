import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import * as argon2 from 'argon2'
import {UserRole} from "./user-role.schema";

@Entity('tbl_user')
export class User extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number

  @Column({unique: true})
  username: string

  @Column()
  contactNumber: string

  @Column()
  email: string

  @Column()
  password: string

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles: UserRole[]

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await argon2.hash(this.password)
    }
  }

}
