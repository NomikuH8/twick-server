import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { Recommendation } from "./Recommendation"

@Entity()
export class Recommender {

  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true })
  twitter: string

  @Column()
  discord: string

  @Column()
  discord_ping: string

  @OneToMany(() => Recommendation, (rec) => rec.recommender)
  recommendations: Recommendation[]

}
