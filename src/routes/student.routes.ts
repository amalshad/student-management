import express from "express";
import { StudentRepository } from "../repositories/student.repository";
import { StudentService } from "../services/student.service";
import { StudentController } from "../controllers/student.controller";

const router = express.Router();

// Dependency Injection
const repo = new StudentRepository();
const service = new StudentService(repo);
const controller = new StudentController(service);

router.post("/", controller.create);
router.get("/", controller.getAll);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

export default router;