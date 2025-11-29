export interface IUserCreationAttributes {
  firstName: string;
  lastName: string;
  email: string;
  password: string; 
  role: 'user' | 'admin';
}

export interface IUserAttributes extends IUserCreationAttributes {
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IVacationCreationAttributes {
  destination: string;
  description: string;
  startDate: Date;
  endDate: Date;
  price: number;
  pictureUrl?: string | null;
}

export interface IVacationAttributes extends IVacationCreationAttributes {
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFollowAttributes {
  userId: string;
  vacationId: string;
  createdAt: Date;
  updatedAt: Date;
}