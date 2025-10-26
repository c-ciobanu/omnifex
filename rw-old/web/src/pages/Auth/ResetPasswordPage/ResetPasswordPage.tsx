import { useEffect, useRef, useState } from 'react'

import { SubmitHandler } from '@redwoodjs/forms'
import { navigate, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { useAuth } from 'src/auth'
import { Form, FormSubmit } from 'src/components/form'
import { FormInput } from 'src/components/form/elements'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from 'src/components/ui/card'

interface FormValues {
  password: string
}

const ResetPasswordPage = ({ resetToken }: { resetToken: string }) => {
  const { reauthenticate, validateResetToken, resetPassword } = useAuth()
  const [enabled, setEnabled] = useState(true)
  const passwordRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const validateToken = async () => {
      const response = await validateResetToken(resetToken)
      if (response.error) {
        setEnabled(false)
        toast.error(response.error)
      } else {
        setEnabled(true)
      }
    }
    validateToken()
  }, [resetToken, validateResetToken])

  useEffect(() => {
    passwordRef.current?.focus()
  }, [])

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const response = await resetPassword({
      resetToken,
      password: data.password,
    })

    if (response.error) {
      toast.error(response.error)
    } else {
      toast.success('Password changed!')
      await reauthenticate()
      navigate(routes.login())
    }
  }

  return (
    <>
      <Metadata title="Reset Password" robots="noindex" />

      <div className="min-h-main flex flex-col items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
          </CardHeader>

          <Form onSubmit={onSubmit}>
            <CardContent className="space-y-6">
              <FormInput
                ref={passwordRef}
                name="password"
                type="password"
                label="New Password"
                disabled={!enabled}
                autoComplete="new-password"
                validation={{
                  required: {
                    value: true,
                    message: 'New Password is required',
                  },
                }}
              />
            </CardContent>

            <CardFooter>
              <FormSubmit disabled={!enabled}>Submit</FormSubmit>
            </CardFooter>
          </Form>
        </Card>
      </div>
    </>
  )
}

export default ResetPasswordPage
