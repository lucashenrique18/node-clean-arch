import { SignUpController } from "./signup-controller";

interface SutTypes {
  sut: SignUpController;
}

const makeSut = (): SutTypes => {
  const sut = new SignUpController();
  return {
    sut,
  };
};

describe("SignUp Controller", () => {
  test("should return 400 if no name is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "any_email",
        password: "any_password",
        passwordConfirmation: "any_passwordConfirmation",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
  });
});
