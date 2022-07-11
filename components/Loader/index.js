import classes from './Loader.module.css'

const animationDelays = [
  '0s',
  '-1.4285714286s',
  '-2.8571428571s',
  '-4.2857142857s',
  '-5.7142857143s',
  '-7.1428571429s',
  '-8.5714285714s',
  '-10s',
]

const Loader = ({ className = '', color = 'var(--white)' }) => {
  return (
    <div className={`${classes.root} ${className}`}>
      <div className={classes.loading}>
        {animationDelays.map((value, idx) => (
          <div
            key={`loader-${idx}-${value}`}
            className={classes.loaderSquare}
            style={{ animationDelay: value, background: color }}
          />
        ))}
      </div>
    </div>
  )
}

export default Loader
