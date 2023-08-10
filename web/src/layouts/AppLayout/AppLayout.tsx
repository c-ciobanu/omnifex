import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import batmanLogo from './batman-logo.svg'

type AppLayoutProps = {
  children?: React.ReactNode
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <>
      <header className="flex h-12 items-center justify-between bg-neutral-800 px-4 text-white">
        <img src={batmanLogo} alt="Logo" title="Batman is here!" />
        <h1 className="text-xl">Favorites Hub</h1>
        <FontAwesomeIcon icon={faMagnifyingGlass} className="text-xl" />
      </header>

      <main className="min-h-main bg-black text-white">{children}</main>
    </>
  )
}

export default AppLayout
