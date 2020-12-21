import { EmailValidatorAdapter } from "./email-validator-adapter";
import validator from "validator";

jest.mock("validator", () => ({
  isEmail(): boolean {
    return true;
  },
}));

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter();
};

describe("Email Validator Adapter", () => {
  test("Should return false if validator returns false ", () => {
    const sut = makeSut();
    jest.spyOn(validator, "isEmail").mockReturnValueOnce(false);
    const isEmailValid = sut.isValid("invalid_email@mail.com");
    expect(isEmailValid).toBe(false);
  });

  test("Should return true if validator returns true ", () => {
    const sut = makeSut();
    const isEmailValid = sut.isValid("valid_email@mail.com");
    expect(isEmailValid).toBe(true);
  });
});
