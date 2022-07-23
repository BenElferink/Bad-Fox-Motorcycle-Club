import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { useState } from 'react'
import { useScreenSize } from '../../contexts/ScreenSizeContext'
import data from '../../data/traits/fox'
import AssetCard from '../AssetCard'
import BaseButton from '../BaseButton'
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
            <BaseButton
              key={`trait-catalog-category-${category}`}
              label={category}
              onClick={() => setSelectedCategory(category)}
              backgroundColor='var(--brown)'
              hoverColor='var(--orange)'
              className={selectedCategory === category ? styles.selectedButton : ''}
              color='var(--black)'
            />
          ))
        )}
      </div>

      <div className={styles.traitCatalog}>
        {data[selectedCategory].map((trait) => (
          <AssetCard
            key={`trait-catalog-list-item-${trait.label}-${trait.gender}`}
            backgroundColor='var(--brown)'
            color='var(--black)'
            mainTitles={[trait.label]}
            imageSrc={trait.image}
            itemUrl={trait.image}
            tableRows={[
              ['Gender:', 'Count:', 'Percent:'],
              [trait.gender, trait.count, trait.percent],
            ]}
          />
        ))}
      </div>
    </div>
  )
}

export default TraitsCatalog
