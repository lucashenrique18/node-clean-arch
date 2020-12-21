import { Controller } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";
import { InvalidParamError, MissingParamError } from "../../errors";
import { badRequest, serverError } from "../../helpers/http-helper";
import { EmailValidator } from "../../protocols/email-validator";
import { AddAccount } from "../../../domain/usecases/add-account/add-account";

export class SignUpController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = [
        "name",
        "email",
        "password",
        "passwordConfirmation",
      ];
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }
      const { email, name, password, passwordConfirmation } = httpRequest.body;
      const isValidEmail = this.emailValidator.isValid(email);
      if (!isValidEmail) {
        return badRequest(new InvalidParamError("email"));
      }
      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError("passwordConfirmation"));
      }
      this.addAccount.add({ email, name, password });
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
