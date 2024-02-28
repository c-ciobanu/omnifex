import { useEffect, useRef, useState } from 'react'

import { Form, Label, PasswordField, Submit, FieldError } from '@redwoodjs/forms'
import { navigate, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { useAuth } from 'src/auth'

const ResetPasswordPage = ({ resetToken }: { resetToken: string }) => {
  const { reauthenticate, validateResetToken, resetPassword } = useAuth()
  const [enabled, setEnabled] = useState(true)

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

  const passwordRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    passwordRef.current?.focus()
  }, [])

  const onSubmit = async (data: Record<string, string>) => {
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
      <Metadata title="Reset Password" />

      <div className="min-h-main flex flex-col items-center justify-center space-y-10">
        <h2 className="text-2xl font-bold">Reset Password</h2>

        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow sm:p-12">
          <Form onSubmit={onSubmit} className="space-y-6">
            <fieldset>
              <Label name="password" className="form-label" errorClassName="form-label form-label-error">
                New Password
              </Label>
              <PasswordField
                name="password"
                className="form-input"
                errorClassName="form-input form-input-error"
                autoComplete="new-password"
                disabled={!enabled}
                ref={passwordRef}
                validation={{
                  required: {
                    value: true,
                    message: 'New Password is required',
                  },
                }}
              />
              <FieldError name="password" className="form-field-error" />
            </fieldset>

            <Submit
              className="w-full rounded-md bg-blue-600 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
              disabled={!enabled}
            >
              Submit
            </Submit>
          </Form>
        </div>
      </div>
    </>
  )
}

export default ResetPasswordPage
