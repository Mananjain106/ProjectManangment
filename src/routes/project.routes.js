import { Router } from "express";


 import { validate } from "../middlewares/validator.midlewares.js";
import { 
  getProject,
    getProjectById,
    getProjectMember,
    deleteMember,
    deleteProject,
    updateMemberRole,
    updateProject,
    createProject,
    addMemberToProject 
 } from "../controller/project.controller.js";
import {
  createProjectValidator,
    addMembertoProjectValidator
} from "../validators/index.js";
import {
     verifyJWT,
    validateProjectPermission,
 } from "../middlewares/auth.midlewares.js";
import { AvaliableUserRoles, UserRolesEnum } from "../utils/constant.js";



const router = Router();
router.use(verifyJWT)


router
.route("/")
.get(getProject)
.post(createProjectValidator(),validate, createProject);


router
.route("/:projectId")
.get(validateProjectPermission(AvaliableUserRoles), getProjectById)
.put(
    validateProjectPermission([UserRolesEnum.ADMIN]),
    createProjectValidator(),
    validate,
    updateProject
)
.delete(
     validateProjectPermission([UserRolesEnum.ADMIN]),deleteProject
)


router
.route("/:projectId/members")
.get(getProjectMember)
.post(
    validateProjectPermission([UserRolesEnum.ADMIN]),
    addMembertoProjectValidator(),
    validate,
    addMemberToProject
)


router
.route("/:projectId/members/:userId")
.put(
     validateProjectPermission([UserRolesEnum.ADMIN]),
     updateMemberRole
)
.delete(
     validateProjectPermission([UserRolesEnum.ADMIN]),
     deleteMember
)


;





export default router