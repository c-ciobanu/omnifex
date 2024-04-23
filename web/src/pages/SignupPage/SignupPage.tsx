import { useRef } from 'react'
import { useEffect } from 'react'

import { Form, Label, TextField, PasswordField, FieldError, Submit } from '@redwoodjs/forms'
import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { useAuth } from 'src/auth'

const SignupPage = () => {
  const { signUp } = useAuth()

  const usernameRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    usernameRef.current?.focus()
  }, [])

  const onSubmit = async (data: Record<string, string>) => {
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
            <fieldset>
              <Label name="username" className="form-label" errorClassName="form-label form-label-error">
                Username
              </Label>
              <TextField
                name="username"
                className="form-input"
                errorClassName="form-input form-input-error"
                ref={usernameRef}
                validation={{
                  required: true,
                  minLength: {
                    value: 3,
                    message: 'Username must be at least 3 characters',
                  },
                }}
              />
              <FieldError name="username" className="form-field-error" />
            </fieldset>

            <fieldset>
              <Label name="password" className="form-label" errorClassName="form-label form-label-error">
                Password
              </Label>
              <PasswordField
                name="password"
                className="form-input"
                errorClassName="form-input form-input-error"
                autoComplete="current-password"
                validation={{
                  required: true,
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                }}
              />
              <FieldError name="password" className="form-field-error" />
            </fieldset>

            <Submit className="w-full rounded-md bg-blue-600 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">
              Sign up
            </Submit>
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
