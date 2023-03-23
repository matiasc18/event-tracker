import styles from '@/styles/SideBar.module.css'

const eventTypes = ['Educational', 'Entertainment', 'Sports', 'Programming', 'Gaming', 'Competitions', 'Dining', 'Student Events']

export default function EventsSideBar() {

  return (
    <section className={styles['side-bar']}>
      <h1 className={styles['side-bar-title']}>Event Types</h1>
      <hr />
      {eventTypes.map((eventType) =>
        <a key={eventType} className={styles['side-bar-type']}>{eventType}</a>)
      }
    </section>
  )
}