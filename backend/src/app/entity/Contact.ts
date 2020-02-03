import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  VersionColumn,
  BeforeInsert,
} from 'typeorm';
import {
  Length,
  IsEmail,
  IsUrl,
  MaxLength,
  IsNumberString,
  IsOptional,
  IsEnum,
} from 'class-validator';
import AbstractEntity from './AbstractEntity';

enum ContactType {
  Company = 'C',
  Person = 'P',
}

@Entity({ name: 'contacts' })
// @Index(['type'])
// @Index(['name'])
// @Index(['email'], { unique: true })
// @Index(['phone1'], { unique: true })
export default class Contact extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Length(1, 1)
  @IsEnum(ContactType)
  @Column()
  type!: string;

  @Length(1, 50)
  @Column()
  name!: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(50)
  @Column()
  email!: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(50)
  @Column()
  website!: string;

  @Length(10, 20)
  @IsNumberString()
  @Column()
  phone1!: string;

  @IsOptional()
  @IsNumberString()
  @MaxLength(6)
  @Column({ name: 'phone1_ext' })
  phone1Extension!: string;

  @IsOptional()
  @IsNumberString()
  @Length(10, 20)
  @Column()
  phone2!: string;

  @IsOptional()
  @IsNumberString()
  @MaxLength(6)
  @Column({ name: 'phone2_ext' })
  phone2Extension!: string;

  @Length(1, 50)
  @Column()
  address!: string;

  @MaxLength(50)
  @Column({ name: 'address_compl' })
  addressComplement!: string;

  @Length(1, 50)
  @Column()
  city!: string;

  @Length(2, 2)
  @Column()
  province!: string;

  @Length(6, 10)
  @Column({ name: 'postal_code' })
  postalCode!: string;

  @Length(2, 2)
  @Column()
  country!: string;

  @Column({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @VersionColumn()
  version!: number;

  @BeforeInsert()
  private beforeInsert(): void {
    // Workaround to solve a bug since 0.2.19 version
    this.createdAt = new Date();
  }

  public constructor(data?: Contact) {
    super();
    if (data) {
      this.id = data.id;
      this.type = data.type;
      this.name = data.name;
      this.email = data.email;
      this.website = data.website;
      this.phone1 = data.phone1;
      this.phone1Extension = data.phone1Extension;
      this.phone2 = data.phone2;
      this.phone2Extension = data.phone2Extension;
      this.address = data.address;
      this.addressComplement = data.addressComplement;
      this.city = data.city;
      this.province = data.province;
      this.postalCode = data.postalCode;
      this.country = data.country;
    }
  }
}
