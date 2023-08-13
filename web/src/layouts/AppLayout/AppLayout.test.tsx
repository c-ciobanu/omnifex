import { render, waitFor } from '@redwoodjs/testing/web'

import AppLayout from './AppLayout'

describe('AppLayout', () => {
  it('renders successfully', async () => {
    await waitFor(() => expect(() => render(<AppLayout />)).not.toThrow())
  })
})
