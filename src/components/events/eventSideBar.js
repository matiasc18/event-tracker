import styles from './styles/side-bar.module.scss'

const eventTypes = ['Educational', 'Entertainment', 'Sports', 'Programming', 'Gaming', 'Competitions', 'Dining', 'Student Events']

export default function EventSideBar({ selected, setSelected }) {
  return (
    <section className={styles['side-bar']}>
      <h1 className={styles['side-bar-title']}>Categories</h1>
      <hr className="main-hr"/>
      <div className={styles['type-container']}>
        <button id="this-week" className={`${selected == 'this-week' ? styles.selected : ''}`} onClick={() => setSelected('this-week')}>This week</button>
        <button id="this-month" className={`${selected == 'this-month' ? styles.selected : ''}`} onClick={() => setSelected('this-month')}>This month</button>
        <hr />
        {eventTypes.map((eventType, index) =>
          <button id={`type-${index + 1}`} key={eventType} className={`${selected == `type-${index + 1}` ? styles.selected : ''}`} onClick={() => setSelected(eventType)}>{eventType}</button>)
        }
      </div>
    </section>
  )
}