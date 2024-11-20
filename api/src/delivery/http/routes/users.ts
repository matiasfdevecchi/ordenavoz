import { BadRequest } from "../../../modules/shared/domain/errors/BadRequest";
import { changePassword } from "../../../modules/users/core/action/ChangePassword";
import { createUser } from "../../../modules/users/core/action/CreateUser";
import { deleteUser } from "../../../modules/users/core/action/DeleteUser";
import { getAllUsers } from "../../../modules/users/core/action/GetAllUsers";
import { replaceRole } from "../../../modules/users/core/action/ReplaceRole";
import { resetPassword } from "../../../modules/users/core/action/ResetPassword";
import { CantDeleteYourself } from "../../../modules/users/core/domain/errors/CantDeleteYourself";
import { getRole, getUserId, getUserIdInPath } from "../utils/Functions";
import Controller from "./controller";

export const createUserController: Controller = async (req, res) => {
    const { name, email, password, role } = req.body;

    const user = await createUser.invoke(getRole(req), { name, email, password, role });

    res.status(201).json(user);
}

export const getAllUsersController: Controller = async (_, res) => {
    const users = await getAllUsers.invoke();
    res.status(200).json(users);
}

export const replaceRoleController: Controller = async (req, res) => {
    const { role } = req.body;

    const user = await replaceRole.invoke(getUserIdInPath(req), role, getRole(req));

    res.status(200).send(user);
}

export const resetPasswordController: Controller = async (req, res) => {
    const { password } = req.body;

    await resetPassword.invoke(getUserIdInPath(req), password, getRole(req));

    res.status(204).send();
}

export const changePasswordController: Controller = async (req, res) => {
    if (getUserId(req) !== getUserIdInPath(req))
        throw new BadRequest("Invalid creds");

    const { oldPassword, password } = req.body;

    await changePassword.invoke(getUserIdInPath(req), oldPassword, password);

    res.status(204).send();
}

export const deleteUserController: Controller = async (req, res) => {
    if (getUserId(req) === getUserIdInPath(req))
        throw new CantDeleteYourself();

    await deleteUser.invoke(getUserIdInPath(req), getRole(req));
    res.status(204).send();
}