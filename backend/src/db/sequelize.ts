import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import * as mysql2 from 'mysql2';
import { User } from '../models/User';
import { Vacation } from '../models/Vacation';
import { Follow } from '../models/Follow';

dotenv.config();


const FALLBACK_PASSWORD = ''; 
const FALLBACK_HOST = 'localhost';
const FALLBACK_DB_NAME = 'vacations_db';
const FALLBACK_PORT = 3306;

const sequelize = new Sequelize({
    dialect: 'mysql',
    dialectModule: mysql2, 
    
    host: process.env.DB_HOST || FALLBACK_HOST,
    port: Number(process.env.DB_PORT) || FALLBACK_PORT,
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || FALLBACK_PASSWORD,
    database: process.env.DB_NAME || FALLBACK_DB_NAME,
    
    models: [User, Vacation, Follow], 
    
    logging: false, 
    
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

export const initDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected successfully.');
        
        await sequelize.sync({ alter: true }); 
        console.log('✅ Database synchronized.');
        
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        throw error; 
    }
};

export default sequelize;