import { useRef } from 'react'
import { useEffect } from 'react'

import { Form, SubmitHandler } from '@redwoodjs/forms'
import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { useAuth } from 'src/auth'
import { Button } from 'src/components/ui/button'
import { FormField, FormInput } from 'src/components/ui/form'

interface FormValues {
  username: string
  password: string
}

const SignupPage = () => {
  const { signUp } = useAuth()
  const usernameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    usernameRef.current?.focus()
  }, [])

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const response = await signUp({ username: data.username, password: data.password })

    if (response.message) {
      toast(response.message)
    } else if (response.error) {
      toast.error(response.error)
    } else {
      // user is signed in automatically
      toast.success('Welcome!')
    }
  }

  return (
    <>
      <Metadata title="Sign up" />

      <div className="min-h-main flex flex-col items-center justify-center space-y-10">
        <h2 className="text-2xl font-bold">Sign up</h2>

        <div className="rounded-lg bg-white p-6 shadow sm:w-full sm:max-w-md sm:p-12">
          <Form onSubmit={onSubmit} className="space-y-6">
            <FormField name="username" label="Username">
              <FormInput
                ref={usernameRef}
                name="username"
                autoComplete="username"
                validation={{
                  required: true,
                  minLength: {
                    value: 3,
                    message: 'Username must be at least 3 characters',
                  },
                }}
              />
            </FormField>

            <FormField name="password" label="Password">
              <FormInput
                name="password"
                type="password"
                autoComplete="new-password"
                validation={{
                  required: true,
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                }}
              />
            </FormField>

            <Button type="submit" className="w-full">
              Sign up
            </Button>
          </Form>
        </div>

        <div>
          <span className="text-sm text-gray-500">Already have an account?</span>{' '}
          <Link to={routes.login()} className="text-sm font-semibold text-blue-600 hover:text-blue-500">
            Sign in!
          </Link>
        </div>
      </div>
    </>
  )
}

export default SignupPage
