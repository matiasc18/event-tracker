import { getUserUniversity, logoutUser } from '@/lib/api/client/auth'
import styles from './styles/nav_bar.module.scss'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState } from 'react'
import { getAuthToken } from '@/utils/auth'
import { FiSearch } from 'react-icons/fi'
import { FaHome } from 'react-icons/fa'
import { useRouter } from 'next/router'
import Link from 'next/link'

// Logout user and set login status to false
const handleLogout = (updateLoginStatus, router) => {
  logoutUser();
  updateLoginStatus(false);
  router.reload();
};

// Gets user's university name and abbreviation
const getUniversity = async (setUniversity) => {
  const authToken = getAuthToken();
  if (!!authToken) {
    const userUniv = await getUserUniversity(authToken);
    setUniversity(userUniv);
  }
}

export default function NavBar() {
  const router = useRouter();

  // Set initial login status to false
  const { updateLoginStatus, loginStatus } = useAuth();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [university, setUniversity] = useState({});

  // Get login status once hydrated
  useEffect(() => {
    setIsSignedIn(loginStatus);

    // Get user's university if they are logged in
    if (loginStatus)
      getUniversity(setUniversity);
  }, [loginStatus]);

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
              {university && <span href="" className={styles['nav-button']}>{university.abbreviation}</span>}
              <span href="" className={styles['nav-button']}>Create</span>
              <span href="" className={styles['nav-button']} onClick={() => handleLogout(updateLoginStatus, router)} >Logout</span>
            </>
          }
          {!isSignedIn && <Link href="/auth/login" className={styles['nav-button']}>Sign in</Link>}
        </div>
      </nav>
    </div>
  )
}