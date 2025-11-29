import { Table, Column, Model, DataType, PrimaryKey, Default, AllowNull, BelongsToMany, HasMany } from 'sequelize-typescript';
import { User } from './User';
import { Follow } from './Follow';

@Table({ tableName: 'vacations', timestamps: true })
export class Vacation extends Model {
    
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    uuid!: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    destination!: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    description!: string;

    @AllowNull(false)
    @Column(DataType.DATEONLY)
    startDate!: Date;

    @AllowNull(false)
    @Column(DataType.DATEONLY)
    endDate!: Date;

    @AllowNull(false)
    @Column(DataType.DECIMAL(10, 2))
    price!: number;

    @AllowNull(true)
    @Column(DataType.STRING)
    pictureUrl?: string;

    @BelongsToMany(() => User, () => Follow)
    followers!: User[];

    @HasMany(() => Follow)
    followEntries!: Follow[];
}