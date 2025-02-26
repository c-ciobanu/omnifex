import { useEffect } from 'react'

import { Loader2 } from 'lucide-react'

import { Metadata } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from 'src/components/ui/card'

const DemoUserLoginPage = () => {
  const { logIn } = useAuth()

  useEffect(() => {
    logIn({ username: 'demo', password: 'demo' })
  }, [])

  return (
    <>
      <Metadata title="Sign in" robots="noindex" />

      <div className="min-h-main flex flex-col items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="text-center">
            <p>Please wait while we sign you into the demo account</p>
          </CardContent>

          <CardFooter className="justify-center">
            <p className="text-xs text-muted-foreground">This will only take a moment...</p>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}

export default DemoUserLoginPage
