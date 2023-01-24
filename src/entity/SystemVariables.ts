import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SystemVariables {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column('json', { nullable: true })
  value: any

  constructor(name: string, value: object) {
    this.name = name
    this.value = value
  }

}