import styles from '@/styles/Navbar.module.css'
import { useState } from 'react'
import { FiSearch } from 'react-icons/fi'
import { RiAccountCircleFill } from 'react-icons/ri'
import { TiPlus } from 'react-icons/ti'

export default function NavBar() {
  const [isSignedIn, setIsSignedIn] = useState(true);

  return (
    <nav className={styles['nav-bar']}>
      <div className={`${styles['nav-control']} ${styles['invisible-div']}`}>
        {isSignedIn ?
          <>
            <a href="" className={styles['nav-button']}>My events</a>
            <RiAccountCircleFill className={styles['nav-account']} />
          </>
          :
          <a href="" className={styles['nav-button']}>Sign in</a>
        }
      </div>
      <div className={styles.searchbar}>
        <input type="text" placeholder="Search..." className={styles.searchinput} />
        <FiSearch className={styles.searchicon} />
      </div>
      <div className={styles['nav-control']}>
        {isSignedIn ?
          <>
            <a href="" className={styles['nav-button']}>My events</a>
            <RiAccountCircleFill className={styles['nav-account']} />
          </>
          :
          <a href="" className={styles['nav-button']}>Sign in</a>
        }
      </div>
    </nav>
  )
}