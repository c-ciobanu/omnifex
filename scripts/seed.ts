import { db } from 'api/src/lib/db'

import { hashPassword } from '@redwoodjs/auth-dbauth-api'

export default async () => {
  try {
    const users = [
      { email: 'john@doe.com', password: 'john1234' },
      { email: 'jane@doe.com', password: 'jane1234' },
    ]

    for (const user of users) {
      const [hashedPassword, salt] = hashPassword(user.password)

      await db.user.create({
        data: {
          email: user.email,
          hashedPassword,
          salt,
        },
      })
    }
  } catch (error) {
    console.warn('Please define your seed data.')
    console.error(error)
  }
}
