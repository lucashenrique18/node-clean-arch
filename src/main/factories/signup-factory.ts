import { DbAddAccount } from "../../data/usecases/add-account/db-add-account";
import { BcryptAdapter } from "../../infra/criptography/bcrypt/bcrypt-adapter";
import { AccountMongoRepository } from "../../infra/db/mongodb/account/account-mongo-repository";
import { SignUpController } from "../../presentation/controllers/signup/signup-controller";
import { EmailValidatorAdapter } from "../../utils/email-validator/email-validator-adapter";

export const makeSignUpController = (): SignUpController => {
  const salt = 12;
  const emailValidatorAdapter = new EmailValidatorAdapter();
  const hasherAdapter = new BcryptAdapter(salt);
  const accountMongoRepository = new AccountMongoRepository();
  const dbAddAccount = new DbAddAccount(hasherAdapter, accountMongoRepository);
  return new SignUpController(emailValidatorAdapter, dbAddAccount);
};
