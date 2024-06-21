import { BadRequestError } from "../errors/BadRequestError";
import { loginDTO, registerDTO } from "../interfaces/login.interface";
import memberModel from "../models/member.model";
import { signToken } from "../utils/jwt";
import { hashPassword, isPasswordMatch } from "../utils/passwordHelper";

export default class AuthService {
  static async loginHandler(loginDTO: loginDTO) {
    const member = await memberModel.findOne({
      memberName: loginDTO.memberName,
    });
    if (!member)
      throw new BadRequestError(
        "Your username does not exist, please try another one or register",
        loginDTO
      );

    const isMatch = await isPasswordMatch(loginDTO.password, member.password);

    if (!isMatch) {
      throw new BadRequestError(
        "Your password is incorrect, please try again",
        loginDTO
      );
    }

    const token = signToken({ userId: member._id });
    return token;
  }
  static async registerHandler(registerDTO: registerDTO) {
    const member = await memberModel.findOne({
      memberName: registerDTO.memberName,
    });
    if (member)
      throw new BadRequestError(
        "Username does exist, please choose another one",
        registerDTO
      );

    const newMember = await memberModel.create({
      ...registerDTO,
      password: await hashPassword(registerDTO.password),
    });
    const token = signToken({ userId: newMember._id });
    return token;
  }
}
