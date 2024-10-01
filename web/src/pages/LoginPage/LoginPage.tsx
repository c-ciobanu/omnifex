import { useRef } from 'react'
import { useEffect } from 'react'

import { Form, SubmitHandler } from '@redwoodjs/forms'
import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { useAuth } from 'src/auth'
import { Button } from 'src/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from 'src/components/ui/card'
import { FormField, FormInput } from 'src/components/ui/form'

interface FormValues {
  username: string
  password: string
}

const LoginPage = () => {
  const { logIn } = useAuth()
  const usernameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    usernameRef.current?.focus()
  }, [])

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const response = await logIn({ username: data.username, password: data.password })

    if (response.message) {
      toast(response.message)
    } else if (response.error) {
      toast.error(response.error)
    } else {
      toast.success('Welcome back!')
    }
  }

  return (
    <>
      <Metadata title="Sign in" />

      <div className="min-h-main flex flex-col items-center justify-center space-y-10">
        <Card>
          <CardHeader>
            <CardTitle>Sign in</CardTitle>
          </CardHeader>

          <Form onSubmit={onSubmit}>
            <CardContent className="space-y-6">
              <FormField name="username" label="Username">
                <FormInput ref={usernameRef} name="username" autoComplete="username" validation={{ required: true }} />
              </FormField>

              <div>
                <FormField name="password" label="Password">
                  <FormInput
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    validation={{ required: true }}
                  />
                </FormField>

                {/* <div className="mt-2 block text-right">
                <Link to={routes.forgotPassword()} className="text-sm font-semibold text-blue-600 hover:text-blue-500">
                  Forgot Password?
                </Link>
              </div> */}
              </div>
            </CardContent>

            <CardFooter>
              <Button type="submit" className="w-full">
                Sign in
              </Button>
            </CardFooter>
          </Form>
        </Card>

        <div>
          <span className="text-sm text-gray-500">Don&apos;t have an account?</span>{' '}
          <Link to={routes.signup()} className="text-sm font-semibold text-blue-600 hover:text-blue-500">
            Sign up!
          </Link>
        </div>
      </div>
    </>
  )
}

export default LoginPage
