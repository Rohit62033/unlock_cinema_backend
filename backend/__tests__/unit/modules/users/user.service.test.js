import { jest } from '@jest/globals'
import { mockUserRepository } from '../../../mocks/repositories.js'




const { updateProfile, getUserBooking } = await import('../../../../src/modules/users/user.service.js')

beforeEach(() => {
  jest.clearAllMocks()
})

describe('update profile service ', () => {

  let user = {}

  test('should throw if no user exists', async () => {

    mockUserRepository.findUserById.mockResolvedValue(null)
    await expect(updateProfile('1', { name: 'jest' })).rejects.toThrow('user not found')


    expect(mockUserRepository.findUserById)
      .toHaveBeenCalledWith('1')
  })

  test('should update only provided fields', async () => {
    const existingUser = {
      _id: '1',
      name: 'oldName',
      avatar: 'oldAvatar'
    }
    mockUserRepository.findUserById.mockResolvedValue(existingUser)

    mockUserRepository.saveUser.mockResolvedValue(existingUser)
    const result = await updateProfile('1', {
      name: 'newName'
    })

    expect(existingUser.name).toBe('newName')
    expect(existingUser.avatar).toBe('oldAvatar') //unchanged

    expect(mockUserRepository.saveUser).toHaveBeenCalledWith(existingUser)

    expect(result).toEqual(existingUser)
  }
  )

  test('should update both name and avatar', async () => {
    const user = {
      _id: '1',
      name: 'old',
      avatar: 'oldAvatar'
    }

    mockUserRepository.findUserById.mockResolvedValue(user)

    mockUserRepository.saveUser.mockResolvedValue(user)

    await updateProfile('1', {
      name: 'new',
      avatar: 'newAvatar'
    })

    expect(user.name).toBe('new')
    expect(user.avatar).toBe('newAvatar')
  })

  test('should not overwrite fields when undefined', async () => {
    const user = {
      _id: '1',
      name: 'existing',
      avatar: 'existingAvatar'
    }

    mockUserRepository.findUserById.mockResolvedValue(user)
    mockUserRepository.saveUser.mockResolvedValue(user)

    await updateProfile('1', {})

    expect(user.name).toBe('existing')
    expect(user.avatar).toBe('existingAvatar')
  })

})


describe('Get user booking', () => {
  test('should return user booking', async () => {
    await getUserBooking('1')
    expect(mockUserRepository.getUserBooking).toHaveBeenCalledWith('1')
  })
})