import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Recommender } from "./Recommender"

@Entity()
export class Recommendation {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  filename: string

  @Column()
  datetime: Date

  @ManyToOne(() => Recommender, (rec) => rec.recommendations)
  recommender: Recommender

  @Column()
  approved: boolean

}