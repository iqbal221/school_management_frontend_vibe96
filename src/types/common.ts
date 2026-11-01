export interface IMeta {
  limit: number;
  page: number;
  total: number;
}

export type ResponseSuccessType = {
  data: any;
  meta?: IMeta;
};

export type IGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorMessages: IGenericErrorMessage[];
};

export type IGenericErrorMessage = {
  path: string | number;
  message: string;
};

export interface IAdmin {
  id: string;
  name: String;
  gender: string;
  managementDepartment: string;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  dateOfBirth: string;
  bloodGroup: string;
  designation: string;
  address: string;
  profileImage: string;
  religion: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IUser {
  id: string;
  userId: string;
  role: string;
  password: string;
  name: String;
  religion: string;
  gender: string;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  dateOfBirth: string;
  bloodGroup: string;
  designation: string;
  address: string;
  profileImage: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IStudent {
  id: string;
  studentIdNumber: string;
  name: string;
  admission: string;
  roll: string;
  fatherName: string;
  motherName: string;
  email: string;
  contact: string;
  emergencyContactNo: string;
  gender: string;
  religious: string;
  dateOfBirth: string;
  bloodGroup: string;
  address: string;
  village: string;
  po: string;
  ps: string;
  dist: string;
  image: string[];
  createdAt: string;
  updatedAt: string;
}
export interface ITeacher {
  id: string;
  name: string;
  designation: string;
  email: string;
  contact: string;
  bloodGroup: string;
  address: string;
  image: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IOfficial {
  id: string;
  name: string;
  designation: string;
  email: string;
  contact: string;
  bloodGroup: string;
  address: string;
  image: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IEntryFees {
  id: string;
  name: string;
  admission: string;
  roll: string;
  feesType: string;
  fees: string;
  entryDate: string;
  comment: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: null;
}

export interface IExpense {
  id: string;
  serialNo: string;
  entryDate: string;
  expenseHead: string;
  expenseType: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: null;
}

export interface IRevenue {
  id: string;
  serialNo: string;
  receiveDate: string;
  receive: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: null;
}

export interface IAuthorization {
  id: string;
  studentIdNumber?: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: null;
}

export interface IAttendance {
  id: string;
  studentIdNumber?: string;
  status: boolean;
  attendanceDate: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: null;
}
