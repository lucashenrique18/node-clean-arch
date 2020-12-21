import { EmailValidatorAdapter } from "./email-validator-adapter";

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter();
};

describe("Email Validator Adapter", () => {
  test("Should return false if validator returns false ", () => {
    const sut = makeSut();
    const isEmailValid = sut.isValid("invalid_email");
    expect(isEmailValid).toBe(false);
  });
});
