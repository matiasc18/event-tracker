import styles from './profile_preview.module.css'
import { RiAccountCircleFill } from 'react-icons/ri'

export default function ProfilePreview() {

  return (
    <section className={styles['profile-snippet']}>
      <h1>Profile</h1>
      <hr className="main-hr" />
      <div className={styles['profile-details']}>
        <RiAccountCircleFill className={styles['profile-icon']} />
        <span className={styles['profile-name']}>Matias Carulli</span>
        <span className={styles['profile-uni']}>University of Central Florida</span>
        <div className={styles['rso-container']}>
          <span className={styles['profile-rso']}>RSO memberships</span>
          <span className={styles['profile-rso-count']}>4</span>
        </div>
        <div className={styles['rso-container']}>
          <span className={styles['profile-rso']}>RSOs owned</span>
          <span className={styles['profile-rso-count']}>1</span>
        </div>
      </div>
    </section>
  )
}