import styles from './styles/profile-preview.module.scss'
import { RiAccountCircleFill } from 'react-icons/ri'

export default function ProfilePreview({ user }) {

  return (
    <>
      {user && <section className={styles['profile-snippet']}>
        <h1>Profile</h1>
        <hr className="main-hr" />
        <div className={styles['profile-details']}>
          <RiAccountCircleFill className={styles['profile-icon']} />
          <span className={styles['profile-name']}>{user.first_name} {user.last_name}</span>
          <span className={styles['profile-uni']}>{user.univ_name}</span>
          <div className={styles['rso-container']}>
            <span className={styles['profile-rso']}>RSO memberships</span>
            <span className={styles['profile-rso-count']}>{user.memberships}</span>
          </div>
          <div className={styles['rso-container']}>
            <span className={styles['profile-rso']}>RSOs owned</span>
            <span className={styles['profile-rso-count']}>{user.ownerships}</span>
          </div>
        </div>
      </section>}
    </>
  )
}