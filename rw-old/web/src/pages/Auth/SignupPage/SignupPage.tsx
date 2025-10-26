import { useEffect, useRef } from 'react'

import { SubmitHandler } from '@redwoodjs/forms'
import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { useAuth } from 'src/auth'
import { Form, FormSubmit } from 'src/components/form'
import { FormInput } from 'src/components/form/elements'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from 'src/components/ui/card'

type FormValues = {
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
    const response = await signUp(data)

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
        <Card>
          <CardHeader>
            <CardTitle>Sign up</CardTitle>
          </CardHeader>

          <Form onSubmit={onSubmit}>
            <CardContent className="space-y-6">
              <FormInput
                ref={usernameRef}
                name="username"
                label="Username"
                autoComplete="username"
                validation={{
                  required: true,
                  minLength: {
                    value: 3,
                    message: 'Username must be at least 3 characters',
                  },
                }}
              />

              <FormInput
                name="password"
                type="password"
                label="Password"
                autoComplete="new-password"
                validation={{
                  required: true,
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                }}
              />
            </CardContent>

            <CardFooter>
              <FormSubmit>Sign up</FormSubmit>
            </CardFooter>
          </Form>
        </Card>

        <div>
          <span className="text-sm text-gray-500">Already have an account?</span>{' '}
          <Link to={routes.login()} className="text-sm font-semibold text-blue-600 hover:text-blue-500">
            Sign in!
          </Link>
        </div>

        <div>
          <p className="text-sm text-gray-500">Not ready to sign up just yet? No worries!</p>
          <Link to={routes.demoUserLogin()} className="text-sm font-semibold text-blue-600 hover:text-blue-500">
            Try out our demo account!
          </Link>
        </div>
      </div>
    </>
  )
}

export default SignupPage
