import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Recommender {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    twitter: string

    @Column()
    discord: string

    @Column()
    ping: string

}
