import { DbAddAccount } from "../../data/usecases/add-account/db-add-account";
import { BcryptAdapter } from "../../infra/criptography/bcrypt/bcrypt-adapter";
import { AccountMongoRepository } from "../../infra/db/mongodb/account/account-mongo-repository";
import { LogMongoRepository } from "../../infra/db/mongodb/log/log-mongo-repository";
import { SignUpController } from "../../presentation/controllers/signup/signup-controller";
import { Controller } from "../../presentation/protocols/controller";
import { EmailValidatorAdapter } from "../../utils/email-validator/email-validator-adapter";
import { LogControllerDecorator } from "../decorators/log";

export const makeSignUpController = (): Controller => {
  const salt = 12;
  const emailValidatorAdapter = new EmailValidatorAdapter();
  const hasherAdapter = new BcryptAdapter(salt);
  const accountMongoRepository = new AccountMongoRepository();
  const dbAddAccount = new DbAddAccount(hasherAdapter, accountMongoRepository);
  const signUpController = new SignUpController(
    emailValidatorAdapter,
    dbAddAccount
  );
  const logMongoRepository = new LogMongoRepository();
  return new LogControllerDecorator(signUpController, logMongoRepository);
};
