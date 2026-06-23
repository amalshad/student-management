import { StudentRepository } from "../repositories/student.repository";
import { CreateStudentDTO, UpdateStudentDTO, Student } from "../interfaces/student.interface";
import { ApiResponse } from "../utils/apiResponse";

export class StudentService {
  constructor(private repo: StudentRepository) {}

  async createStudent(dto: CreateStudentDTO): Promise<ApiResponse<Student>> {
    try {
      if (!dto.name || !dto.email) {
        return { success: false, message: "Invalid input" };
      }

      const student: Student = {
        id: Date.now().toString(),
        ...dto,
        createdAt: new Date()
      };

      const data = await this.repo.create(student);

      return { success: true, data };

    } catch {
      return { success: false, message: "Create failed" };
    }
  }

  async getStudents(): Promise<ApiResponse<Student[]>> {
    try {
      const data = await this.repo.findAll();
      return { success: true, data };
    } catch {
      return { success: false, message: "Fetch failed" };
    }
  }

  async updateStudent(id: string, dto: UpdateStudentDTO): Promise<ApiResponse<Student>> {
    try {
      const updated = await this.repo.update(id, dto);

      if (!updated) {
        return { success: false, message: "Student not found" };
      }

      return { success: true, data: updated };

    } catch {
      return { success: false, message: "Update failed" };
    }
  }

  async deleteStudent(id: string): Promise<ApiResponse<null>> {
    try {
      const deleted = await this.repo.delete(id);

      if (!deleted) {
        return { success: false, message: "Student not found" };
      }

      return { success: true, message: "Deleted successfully" };

    } catch {
      return { success: false, message: "Delete failed" };
    }
  }
}