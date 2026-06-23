import { Request, Response } from "express";
import { StudentService } from "../services/student.service";

export class StudentController {
  constructor(private service: StudentService) {}

  create = async (req: Request, res: Response) => {
    const result = await this.service.createStudent(req.body);
    res.json(result);
  };

  getAll = async (_req: Request, res: Response) => {
    const result = await this.service.getStudents();
    res.json(result);
  };

  update = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await this.service.updateStudent(id, req.body);
    res.json(result);
  };

  delete = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await this.service.deleteStudent(id);
    res.json(result);
  };
}