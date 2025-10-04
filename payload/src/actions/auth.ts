'use server'

import { LoginInterface } from "@/components/forms/structs/login"
import { login, logout } from '@payloadcms/next/auth'
import config from '@payload-config'
import { RegisterInterface } from "@/components/forms/structs/register"
import { getPayload } from "payload"
import { User } from "@/payload-types"

export const loginAction = async (data: LoginInterface) => {
  const { email, password } = data

  try {
      const result = await login({
        collection: 'users',
        config,
        email,
        password,
      })

      return result
    } catch (error) {
      throw new Error(
        `Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
}

export const logoutAction = async () => {
  try {
    await logout({ config })
  } catch (error) {
    throw new Error(
      `Logout failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}

export const registerAction = async (data: RegisterInterface) => {
  const { email, password, fullName, userType } = data
  const payload = await getPayload({ config })

  try {
    const user: User = await payload.create({
      collection: 'users',
      data: {
        email,
        password,
        fullName,
        userType,
      },
    })

    const result = await login({
      collection: 'users',
      config,
      email: user.email,
      password,
    })

    return result
  } catch (error) {
    throw new Error(
      `Registration failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}
