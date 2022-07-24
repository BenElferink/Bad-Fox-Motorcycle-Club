import { MenuItem, TextField } from '@mui/material'
import { useState } from 'react'
import { useScreenSize } from '../../../../contexts/ScreenSizeContext'
import data from '../../../../data/traits/fox'
import AssetCard from '../../../AssetCard'
import BaseButton from '../../../BaseButton'
import styles from './FoxTraitsCatalog.module.css'

const FoxTraitsCatalog = () => {
  const { isMobile } = useScreenSize()
  const [selectedCategory, setSelectedCategory] = useState('Skin + Tail')

  return (
    <div>
      <div className={styles.categoryButtons}>
        {isMobile ? (
          <TextField
            select
            label='Category'
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            sx={{ width: 300 }}
          >
            {Object.keys(data).map((category) => (
              <MenuItem key={`trait-catalog-category-${category}`} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
        ) : (
          Object.keys(data).map((category) => (
            <BaseButton
              key={`trait-catalog-category-${category}`}
              label={category}
              onClick={() => setSelectedCategory(category)}
              backgroundColor='var(--brown)'
              hoverColor='var(--orange)'
              className={selectedCategory === category ? styles.selectedButton : ''}
            />
          ))
        )}
      </div>

      <div className={styles.traitCatalog}>
        {data[selectedCategory].map((trait) => (
          <AssetCard
            key={`trait-catalog-list-item-${trait.label}-${trait.gender}`}
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

export default FoxTraitsCatalog
