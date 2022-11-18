import { AccountModel } from "../usecases/add-account/db-add-account-protocols.index";

export interface LoadAccountByEmailRepository {
    load(email: string): Promise<AccountModel>
}