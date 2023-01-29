import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class LoggedUser {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  banner_image_link: string

  @Column()
  profile_picture_link: string

  @Column()
  name: string

  @Column()
  screen_name: string // @

  @Column()
  access_token: string

  @Column()
  access_token_secret: string

}