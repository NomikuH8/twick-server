import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class ScheduledPost {

  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true, length: 280 })
  text: string

  @Column()
  timestamp: Date

  @Column('json')
  images: string[]
}