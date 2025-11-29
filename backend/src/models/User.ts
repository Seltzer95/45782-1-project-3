import { Table, Column, Model, DataType, PrimaryKey, Default, AllowNull, Unique, BeforeCreate, BelongsToMany } from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';
import { Vacation } from './Vacation';
import { Follow } from './Follow';

@Table({ tableName: 'users', timestamps: true })
export class User extends Model {
    
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    uuid!: string;

    @AllowNull(false)
    @Column(DataType.STRING(50))
    firstName!: string;

    @AllowNull(false)
    @Column(DataType.STRING(50))
    lastName!: string;

    @AllowNull(false)
    @Unique
    @Column(DataType.STRING(100))
    email!: string;

    @AllowNull(false)
    @Column(DataType.STRING(255))
    password!: string;

    @Default('user')
    @Column(DataType.ENUM('user', 'admin'))
    role!: 'user' | 'admin';

    @BelongsToMany(() => Vacation, () => Follow)
    vacations!: Vacation[];

    @BeforeCreate
    static async hashPassword(instance: User) {
        if (instance.password) {
            const salt = await bcrypt.genSalt(10);
            instance.password = await bcrypt.hash(instance.password, salt);
        }
    }

    async validPassword(password: string): Promise<boolean> {
        return await bcrypt.compare(password, this.password);
    }
}