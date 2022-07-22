import React, { useEffect, useState } from 'react'
import ReactToggle from 'react-toggle'
import 'react-toggle/style.css'

function Toggle({
  labelLeft = 'off',
  labelRight = 'on',
  showIcons = false,
  state: { value, setValue },
  style = {},
}) {
  const [toggle, setToggle] = useState(value ?? false)

  const styles = {
    label: {
      width: 'fit-content',
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      ...style,
    },
    span: {
      margin: '0 4px',
    },
  }

  useEffect(() => {
    setValue(toggle)
    return () => {
      setValue(toggle)
    }
  }, [setValue, toggle])

  return (
    <label style={styles.label}>
      <span style={styles.span}>{labelLeft}</span>
      <ReactToggle icons={showIcons} defaultChecked={toggle} onChange={() => setToggle((prev) => !prev)} />
      <span style={styles.span}>{labelRight}</span>
    </label>
  )
}

export default Toggle
