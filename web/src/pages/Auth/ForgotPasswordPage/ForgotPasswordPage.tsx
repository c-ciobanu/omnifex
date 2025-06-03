import { useEffect, useRef } from 'react'

import { SubmitHandler } from '@redwoodjs/forms'
import { navigate, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { useAuth } from 'src/auth'
import { Form, FormSubmit } from 'src/components/form'
import { FormInput } from 'src/components/form/elements'
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
              <FormInput
                ref={emailRef}
                name="email"
                type="email"
                label="Email Address"
                autoComplete="email"
                validation={{
                  required: {
                    value: true,
                    message: 'Email is required',
                  },
                }}
              />
            </CardContent>

            <CardFooter>
              <FormSubmit>Submit</FormSubmit>
            </CardFooter>
          </Form>
        </Card>
      </div>
    </>
  )
}

export default ForgotPasswordPage
