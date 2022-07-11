import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import Image from 'next/image'
import { useState } from 'react'
import { useScreenSize } from '../../contexts/ScreenSizeContext'
import data from '../../data/traits.json'
import Loader from '../Loader'
import styles from './TraitsCatalog.module.css'

const TraitsCatalog = () => {
  const { isMobile } = useScreenSize()
  const [selectedCategory, setSelectedCategory] = useState('Skin + Tail')

  const LoaderImage = ({ src, alt }) => {
    const [loading, setLoading] = useState(true)

    return (
      <div className={styles.traitCardImageWrapper}>
        <Image
          className={styles.traitCardImage}
          src={src}
          alt={alt}
          width={isMobile ? 250 : 300}
          height={isMobile ? 250 : 300}
          onLoadingComplete={() => setLoading(false)}
        />
        {loading ? <Loader className={styles.traitCardLoader} color='var(--black)' /> : null}
      </div>
    )
  }

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
            <LoaderImage src={trait.image} alt={trait.label} />
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
