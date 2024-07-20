import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter';

jest.mock('bcrypt', () => ({
    async hash(): Promise<string> {
        return new Promise((resolve) => resolve('hash_value'))
    }
}))

const salt = 12
const makeSut = () => {
    return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {

    test('Should call Bcrypt with correct value', async () => {
        const sut = makeSut()
        await sut.encrypt('any_value');
        const hashSply = jest.spyOn(bcrypt, 'hash')
        await sut.encrypt('any_value')
        expect(hashSply).toHaveBeenCalledWith('any_value', salt)
    })

    test('Should return a hash on success', async () => {
        const sut = new BcryptAdapter(salt)
        await sut.encrypt('any_value');
        const hash = await sut.encrypt('any_value')
        expect(hash).toBe('hash_value')
    })

    test('Should throw if bcrypt throws', async () => {
        const sut = makeSut()
        // jest.spyOn(bcrypt, 'hash').mockReturnValueOnce(new Promise<string>((resolve, reject) => reject(new Error())))
        jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => { throw new Error() })
        const promise = sut.encrypt('any_value')
        await expect(promise).rejects.toThrow()
    })

})
