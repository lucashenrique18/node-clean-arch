import { AccountModel } from "../../../domain/models/account-model";
import {
  AddAccount,
  AddAccountModel,
} from "../../../domain/usecases/add-account/add-account";
import { Hasher } from "../../protocols/criptography/hasher";

export class DbAddAccount implements AddAccount {
  constructor(private readonly hasher: Hasher) {}

  async add(accountData: AddAccountModel): Promise<AccountModel> {
    await this.hasher.hash(accountData.password);
    return null;
  }
}
