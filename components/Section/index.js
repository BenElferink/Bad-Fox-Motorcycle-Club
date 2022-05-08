import styles from './Section.module.css'

export default function Section({ children, style = {}, noFlex = false, flexDirection = 'col' }) {
  return (
    <section className={`${styles.root}${noFlex ? '' : ` flex-${flexDirection}`}`} style={style}>
      {children}
    </section>
  )
}
