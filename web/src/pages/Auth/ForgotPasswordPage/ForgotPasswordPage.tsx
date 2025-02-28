import { useEffect, useRef } from 'react'

import { Form, SubmitHandler } from '@redwoodjs/forms'
import { navigate, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { useAuth } from 'src/auth'
import { FormField, FormInput } from 'src/components/OldForm/OldForm'
import { Button } from 'src/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from 'src/components/ui/card'

interface FormValues {
  email: string
}

const ForgotPasswordPage = () => {
  const { forgotPassword } = useAuth()
  const emailRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    emailRef?.current?.focus()
  }, [])

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const response = await forgotPassword(data.email)

    if (response.error) {
      toast.error(response.error)
    } else {
      // The function `forgotPassword.handler` in api/src/functions/auth.js has
      // been invoked, let the user know how to get the link to reset their
      // password (sent in email, perhaps?)
      toast.success('A link to reset your password was sent to ' + response.email)
      navigate(routes.login())
    }
  }

  return (
    <>
      <Metadata title="Forgot Password" />

      <div className="min-h-main flex flex-col items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Forgot Password</CardTitle>
          </CardHeader>

          <Form onSubmit={onSubmit}>
            <CardContent className="space-y-6">
              <FormField name="email" label="Email Address">
                <FormInput
                  ref={emailRef}
                  name="email"
                  type="email"
                  autoComplete="email"
                  validation={{
                    required: {
                      value: true,
                      message: 'Email is required',
                    },
                  }}
                />
              </FormField>
            </CardContent>

            <CardFooter>
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </CardFooter>
          </Form>
        </Card>
      </div>
    </>
  )
}

export default ForgotPasswordPage
