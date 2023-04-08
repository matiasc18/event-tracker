import styles from './styles/nav_bar.module.css'
import { useAuth } from '@/contexts/AuthContext'
// import { TbBrandNextjs } from 'react-icons/tb'
import { useEffect, useState } from 'react'
import { FiSearch } from 'react-icons/fi'
import { FaHome } from 'react-icons/fa'
import { useRouter } from 'next/router'
// import { ImCog } from 'react-icons/im'
import { logoutUser } from '@/lib/api/client/auth'
import Link from 'next/link'

export default function NavBar() {
  // Set initial login status to false
  const [isSignedIn, setIsSignedIn] = useState(false);
  
  const { accessLoginStatus } = useAuth();
  const router = useRouter();

  // Get login status once hydrated
  useEffect(() => {
    setIsSignedIn(accessLoginStatus('get', null));
  }, []);

  // Logout user and set login status to false
  function handleLogout(e) {
    logoutUser();
    accessLoginStatus('set', false);
    setIsSignedIn(false);
  }

  return (
    <div className={styles['nav-container']}>
      <nav className={styles['nav-bar']}>
        <div className={styles.searchbar}>
          <FaHome className={styles.logo} onClick={() => router.push('/')} />
          <input type="text" placeholder="Search..." className={styles.searchinput} />
          <FiSearch className={styles.searchicon} />
        </div>
        {/* Displays different navbar controls whether user is signed in */}
        <div className={styles['nav-control']}>
          {isSignedIn &&
            <>
              <span href="" className={styles['nav-button']}>University name</span>
              <span href="" className={styles['nav-button']}>Create</span>
              <span href="" className={styles['nav-button']} onClick={(e) => handleLogout(e)} >Logout</span>
            </>
          }
          {!isSignedIn && <Link href="/auth/login" className={styles['nav-button']}>Sign in</Link>}
        </div>
      </nav>
    </div>
  )
}