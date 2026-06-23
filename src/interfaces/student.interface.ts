export interface CreateStudentDTO {
  name: string;
  age: number;
  email: string;
}

export interface UpdateStudentDTO {
  name?: string;
  age?: number;
  email?: string;
}

export interface Student {
  id: string;
  name: string;
  age: number;
  email: string;
  createdAt: Date;
}