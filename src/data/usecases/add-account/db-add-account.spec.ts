
import { DbAddAccount } from './db-add-account';
import { AccountModel, AddAccountModel, AddAccountRepository, Encrypter } from './db-add-account-protocols.index';

const makeEncrypter = (): Encrypter => {
    class EncrypterStub implements Encrypter {
        async encrypt(value: string): Promise<string> {
            return new Promise(resolve => resolve('hashed_password'))
        }
    }
    return new EncrypterStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
    class AddAccountRepositoryStub implements AddAccountRepository {
        async add(account: AddAccountModel): Promise<AccountModel> {
            return new Promise(resolve => resolve(makeFakeAccount()))
        }
    }
    return new AddAccountRepositoryStub()
}

const makeFakeAccount = (params?): AccountModel => {
    let account = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email',
        password: 'hashed_password'
    }
    switch (params) {
        case 'makeFakeAccountData':
            delete account.id
            return account
    }
    return account
}

interface SutTypes {
    sut: DbAddAccount
    encrypterStub: Encrypter,
    addAccountRepositoryStub: AddAccountRepository
}

const makeSut = (): SutTypes => {
    const encrypterStub = makeEncrypter()
    const addAccountRepositoryStub = makeAddAccountRepository()
    const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)
    return {
        sut,
        encrypterStub,
        addAccountRepositoryStub
    }
}

describe('DbAddAccount Usecaser', () => {

    test('Should call Encrypter with correct password', async () => {
        const { sut, encrypterStub } = makeSut()
        const encryptSply = jest.spyOn(encrypterStub, 'encrypt')
        await sut.add(makeFakeAccount('makeFakeAccountData'))
        expect(encryptSply).toHaveBeenCalledWith('hashed_password')
    })

    test('Should throw if Encrypter thrwos', async () => {
        const { sut, encrypterStub } = makeSut()
        const encryptSply = jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => {
            reject(new Error())
        }))
        const promise = sut.add(makeFakeAccount('makeFakeAccountData'))
        await expect(promise).rejects.toThrow()
    })

    test('Should call AddAccountRepository with correct values', async () => {
        const { sut, addAccountRepositoryStub } = makeSut()
        const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
        await sut.add(makeFakeAccount('makeFakeAccountData'))
        expect(addSpy).toHaveBeenCalledWith(makeFakeAccount('makeFakeAccountData'))
    })

    test('Should return an account on success', async () => {
        const { sut } = makeSut()
        const account = await sut.add(makeFakeAccount('makeFakeAccountData'))
        expect(account).toEqual(makeFakeAccount())
    })

})