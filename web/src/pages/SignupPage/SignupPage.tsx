import { useRef } from 'react'
import { useEffect } from 'react'

import { Form, Label, TextField, PasswordField, FieldError, Submit } from '@redwoodjs/forms'
import { Link, navigate, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { useAuth } from 'src/auth'
import { useLocalMovies } from 'src/hooks/useLocalMovies/useLocalMovies'

const SignupPage = () => {
  const { isAuthenticated, signUp } = useAuth()
  const { localMovies, resetLocalMovies } = useLocalMovies()

  useEffect(() => {
    if (isAuthenticated) {
      navigate(routes.home())
    }
  }, [isAuthenticated])

  // focus on email box on page load
  const emailRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    emailRef.current?.focus()
  }, [])

  const onSubmit = async (data: Record<string, string>) => {
    const response = await signUp({ username: data.email, password: data.password, ...localMovies })

    if (response.message) {
      toast(response.message)
    } else if (response.error) {
      toast.error(response.error)
    } else {
      // user is signed in automatically
      resetLocalMovies()
      toast.success('Welcome!')
    }
  }

  return (
    <>
      <MetaTags title="Signup" />

      <div className="flex min-h-[inherit] flex-col items-center justify-center space-y-10">
        <h2 className="text-2xl font-bold">Signup</h2>

        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow sm:p-12">
          <Form onSubmit={onSubmit} className="space-y-6">
            <fieldset>
              <Label name="email" className="form-label" errorClassName="form-label form-label-error">
                Email address
              </Label>
              <TextField
                name="email"
                className="form-input"
                errorClassName="form-input form-input-error"
                ref={emailRef}
                validation={{
                  required: {
                    value: true,
                    message: 'Email is required',
                  },
                }}
              />
              <FieldError name="email" className="form-field-error" />
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
                  required: {
                    value: true,
                    message: 'Password is required',
                  },
                }}
              />
              <FieldError name="password" className="form-field-error" />
            </fieldset>

            <Submit className="w-full rounded-md bg-blue-600 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">
              Sign Up
            </Submit>
          </Form>
        </div>

        <div>
          <span className="text-sm text-gray-500">Already have an account?</span>{' '}
          <Link to={routes.login()} className="text-sm font-semibold text-blue-600 hover:text-blue-500">
            Log in!
          </Link>
        </div>
      </div>
    </>
  )
}

export default SignupPage
