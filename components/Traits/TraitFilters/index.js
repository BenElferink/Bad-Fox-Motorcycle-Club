import { MenuItem, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useScreenSize } from '../../../contexts/ScreenSizeContext'
import BaseButton from '../../BaseButton'
import styles from './TraitFilters.module.css'

const TraitFilters = ({ traitsData = {}, callbackSelectedCategory = () => {}, children }) => {
  const { isMobile } = useScreenSize()
  const [selectedCategory, setSelectedCategory] = useState('Skin')

  useEffect(() => {
    callbackSelectedCategory(selectedCategory)
  }, [selectedCategory])

  return (
    <div className={styles.categoryButtons}>
      {isMobile ? (
        <TextField
          select
          label='Category'
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          sx={{ width: 300 }}
        >
          {Object.entries(traitsData)
            .sort((a, b) => a[0][0].localeCompare(b[0][0]))
            .map(([category, traits]) => (
              <MenuItem key={`category-option-${category}`} value={category}>
                {category} ({traits.length})
              </MenuItem>
            ))}
        </TextField>
      ) : (
        Object.entries(traitsData)
          .sort((a, b) => a[0][0].localeCompare(b[0][0]))
          .map(([category, traits]) =>
            category !== 'Gender' && category !== 'Model' ? (
              <BaseButton
                key={`category-button-${category}`}
                label={`${category} (${traits.length})`}
                onClick={() => setSelectedCategory(category)}
                backgroundColor='var(--brown)'
                hoverColor='var(--orange)'
                className={selectedCategory === category ? styles.selectedButton : ''}
              />
            ) : null
          )
      )}

      {children}
    </div>
  )
}

export default TraitFilters
