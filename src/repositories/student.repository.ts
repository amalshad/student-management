import { Student } from "../interfaces/student.interface";
import { StudentModel } from "../models/student.model";

export class StudentRepository {
  async create(student: Student): Promise<Student> {
    const doc = await StudentModel.create({
      name: student.name,
      age: student.age,
      email: student.email
    });
    return {
      id: doc._id.toString(),
      name: doc.name,
      age: doc.age,
      email: doc.email,
      createdAt: doc.createdAt
    };
  }

  async findAll(): Promise<Student[]> {
    const docs = await StudentModel.find().sort({ createdAt: -1 });
    return docs.map(doc => ({
      id: doc._id.toString(),
      name: doc.name,
      age: doc.age,
      email: doc.email,
      createdAt: doc.createdAt
    }));
  }

  async findById(id: string): Promise<Student | null> {
    try {
      const doc = await StudentModel.findById(id);
      if (!doc) return null;
      return {
        id: doc._id.toString(),
        name: doc.name,
        age: doc.age,
        email: doc.email,
        createdAt: doc.createdAt
      };
    } catch {
      return null;
    }
  }

  async update(id: string, data: Partial<Student>): Promise<Student | null> {
    try {
      const doc = await StudentModel.findByIdAndUpdate(
        id,
        {
          name: data.name,
          age: data.age,
          email: data.email
        },
        { new: true }
      );
      if (!doc) return null;
      return {
        id: doc._id.toString(),
        name: doc.name,
        age: doc.age,
        email: doc.email,
        createdAt: doc.createdAt
      };
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await StudentModel.findByIdAndDelete(id);
      return !!result;
    } catch {
      return false;
    }
  }
}