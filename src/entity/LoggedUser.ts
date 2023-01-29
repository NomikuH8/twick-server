import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
export class LoggedUser {

  @PrimaryGeneratedColumn()
  id: number

  @Unique('unique_user', ['twitter_id'])
  @Column({ nullable: true })
  twitter_id: string

  @Column({ nullable: true })
  banner_image_link: string

  @Column({ nullable: true })
  profile_picture_link: string

  @Column({ nullable: true })
  name: string

  @Column({ nullable: true })
  screen_name: string // @

  @Column()
  access_token: string

  @Column()
  access_token_secret: string

}