import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { Recommendation } from "./Recommendation"

@Entity()
export class Recommender {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  twitter: string

  @Column()
  discord: string

  @Column()
  discord_ping: string

  @OneToMany(() => Recommendation, (rec) => rec.recommender)
  recommendations: Recommendation[]

}
