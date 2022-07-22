import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { useState } from 'react'
import { useScreenSize } from '../../contexts/ScreenSizeContext'
import data from '../../data/traits/fox'
import LoadingImage from './LoadingImage'
import styles from './TraitsCatalog.module.css'

const TraitsCatalog = () => {
  const { isMobile } = useScreenSize()
  const [selectedCategory, setSelectedCategory] = useState('Skin + Tail')

  return (
    <div>
      <div className={styles.categoryButtons}>
        {isMobile ? (
          <FormControl variant='filled' sx={{ minWidth: 270 }}>
            <InputLabel id='select-category-label'>Category</InputLabel>
            <Select
              labelId='select-category-label'
              id='select-category'
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {Object.keys(data).map((category) => (
                <MenuItem key={`trait-catalog-category-${category}`} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          Object.keys(data).map((category) => (
            <button
              key={`trait-catalog-category-${category}`}
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? styles.selectedButton : ''}
            >
              {category}
            </button>
          ))
        )}
      </div>

      <div className={styles.traitCatalog}>
        {data[selectedCategory].map((trait) => (
          <div key={`trait-catalog-list-item-${trait.label}-${trait.gender}`} className={styles.traitCard}>
            <LoadingImage src={trait.image} alt={trait.label} />
            <h3 className={styles.traitCardTitle}>{trait.label}</h3>
            <table className={styles.traitCardTable}>
              <thead>
                <tr>
                  <th>Gender:</th>
                  <th>Count:</th>
                  <th>Percent:</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{trait.gender}</td>
                  <td>{trait.count}</td>
                  <td>{trait.percent}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TraitsCatalog
