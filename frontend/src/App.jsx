import {Outlet} from 'react-router-dom'

import {Toaster} from 'react-hot-toast'
import Navigation from './pages/Auth/Navigation'

const App = () => {
  return (
    <>
   
    <Toaster />
    <div>
      <Navigation />
      <main className='overflow-x-hidden'>
        <Outlet />
      </main>
    </div>
    </>
  )
}

export default App