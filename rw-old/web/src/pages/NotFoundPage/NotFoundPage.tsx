import { Metadata } from '@redwoodjs/web'

import AppLayout from 'src/layouts/AppLayout/AppLayout'

export default () => (
  <>
    <Metadata title="Not Found" robots="noindex" />

    <AppLayout>
      <section className="min-h-main flex flex-col items-center justify-center">
        <h1 className="rounded bg-white px-24 py-4 text-3xl text-gray-700 shadow">404 Page Not Found</h1>
      </section>
    </AppLayout>
  </>
)
