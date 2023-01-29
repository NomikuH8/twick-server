import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

interface image {
  filename: string
}

@Entity()
export class ScheduledPost {

  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true, length: 280 })
  text: string

  @Column('json')
  images: image[]
}