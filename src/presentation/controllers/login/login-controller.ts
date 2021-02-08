import { Authentication } from "../../../domain/authentication/authentication";
import { InvalidParamError, MissingParamError } from "../../errors";
import { UnauthorizedError } from "../../errors/unauthorized-error";
import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from "../../helpers/http-helper";
import { Controller } from "../../protocols/controller";
import { EmailValidator } from "../../protocols/email-validator";
import { HttpRequest, HttpResponse } from "../../protocols/http";

export class LoginController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ["email", "password"];
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }
      const { email, password } = httpRequest.body;
      const isValidEmail = this.emailValidator.isValid(email);
      if (!isValidEmail) {
        return badRequest(new InvalidParamError("email"));
      }
      const accessToken = await this.authentication.auth(email, password);
      if (!accessToken) {
        return unauthorized();
      }
      return ok(accessToken);
    } catch (error) {
      console.error(error);
      return serverError(error);
    }
  }
}
