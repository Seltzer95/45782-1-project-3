import { Table, Column, Model, ForeignKey, DataType } from 'sequelize-typescript';
import { User } from './User';
import { Vacation } from './Vacation';

@Table({ tableName: 'follows', timestamps: true })
export class Follow extends Model {
    
    @ForeignKey(() => User)
    @Column(DataType.UUID)
    userId!: string;

    @ForeignKey(() => Vacation)
    @Column(DataType.UUID)
    vacationId!: string;
}