import { resolve } from "path";
import { AddAccountRepository } from "../../../../data/protocols/db/account/add-account-repository";
import { AccountModel } from "../../../../domain/models/account-model";
import { AddAccountModel } from "../../../../domain/usecases/add-account/add-account";
import { MongoHelper } from "../helpers/mongo-helper";

export class AccountMongoRepository implements AddAccountRepository {
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection("accounts");
    const result = await (await accountCollection).insertOne(accountData);
    const account = MongoHelper.map(result.ops[0]);
    return account;
  }
}
