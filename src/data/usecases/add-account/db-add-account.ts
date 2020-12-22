import { AccountModel } from "../../../domain/models/account-model";
import {
  AddAccount,
  AddAccountModel,
} from "../../../domain/usecases/add-account/add-account";
import { Hasher } from "../../protocols/criptography/hasher";
import { AddAccountRepository } from "../../protocols/db/account/add-account-repository";

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.hasher.hash(accountData.password);
    const newAccount = await this.addAccountRepository.add(
      Object.assign({}, accountData, { password: hashedPassword })
    );
    return new Promise((resolve) => resolve(newAccount));
  }
}
