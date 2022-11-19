import { AuthenticationModel } from "../../../domain/usecases/authentication"
import { LoadAccountByEmailRepository } from "../../../data/protocols/load-account-repository"
import { AccountModel } from "../add-account/db-add-account-protocols.index"
import { DbAuthentication } from "./db-authentication"

const makeFakeAccount = (): AccountModel => {
    return {
        id: 'any_id',
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
    }
}

const makeFakeAuthentication = (): AuthenticationModel => {
    return { email: 'any_email@mail.com', password: 'any_password' }
}

const makeLoadAccountByEmailRepository = () => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
        async load(email: string): Promise<AccountModel> {
            return new Promise(resolve => resolve(makeFakeAccount()))
        }
    }
    return new LoadAccountByEmailRepositoryStub()
}

interface SutTypes {
    sut: DbAuthentication,
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
    const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)
    return { sut, loadAccountByEmailRepositoryStub }
}

describe('DbAuthentication Usecase', () => {
    test('Should call loadAccountByEmailRepository with correct email', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
        await sut.auth(makeFakeAuthentication())
        expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
    })
})