import { resolve } from "path";
import { Authentication } from "../../../domain/authentication/authentication";
import {
  InvalidParamError,
  MissingParamError,
  ServerError,
} from "../../errors";
import { UnauthorizedError } from "../../errors/unauthorized-error";
import { badRequest, ok, serverError } from "../../helpers/http-helper";
import { EmailValidator } from "../../protocols/email-validator";
import { HttpRequest } from "../../protocols/http";
import { LoginController } from "./login-controller";

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: "any_email@mail.com",
    password: "any_password",
  },
});

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(email: string, password: string): Promise<string> {
      return new Promise((resolve) => resolve("any_token"));
    }
  }
  return new AuthenticationStub();
};

interface SutTypes {
  sut: LoginController;
  emailValidatorStub: EmailValidator;
  authenticationStub: Authentication;
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const authenticationStub = makeAuthentication();
  const sut = new LoginController(emailValidatorStub, authenticationStub);
  return {
    sut,
    emailValidatorStub,
    authenticationStub,
  };
};

describe("Login Controller", () => {
  test("should return 400 if no email is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        password: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError("email")));
  });
  test("should return 400 if no email is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "any_email@mail.com",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError("password")));
  });
  test("Should return 400 if an invalid email is provided ", async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new InvalidParamError("email")));
  });
  test("Should call EmailValidator with correct email", async () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid");
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith("any_email@mail.com");
  });
  test("Should return 500 if EmailValidator throws", async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
      throw new Error();
    });
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });
  test("Should call Authentication with correct values", async () => {
    const { sut, authenticationStub } = makeSut();
    const authSpy = jest.spyOn(authenticationStub, "auth");
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(authSpy).toHaveBeenCalledWith("any_email@mail.com", "any_password");
  });
  test("Should return 401 if invalid credentials are provided", async () => {
    const { sut, authenticationStub } = makeSut();
    jest
      .spyOn(authenticationStub, "auth")
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(401);
    expect(httpResponse.body).toEqual(new UnauthorizedError());
  });
  test("Should return 500 if Authentication throws", async () => {
    const { sut, authenticationStub } = makeSut();
    jest.spyOn(authenticationStub, "auth").mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()));
    });
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });
  test("Should return 200 if valid data is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(ok("any_token"));
  });
});
