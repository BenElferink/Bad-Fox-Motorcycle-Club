import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import {
  AppBar,
  Box,
  Chip,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from '@mui/material'
import { CloseRounded, TuneRounded as FilterIcon } from '@mui/icons-material'
import { useScreenSize } from '../../../contexts/ScreenSizeContext'
import { useMarket } from '../../../contexts/MarketContext'
import Toggle from '../../Toggle'
import BaseButton from '../../BaseButton'
import styles from './AssetFilters.module.css'

const AssetFilters = ({ traitsMatrix = [], assetsArr = [], callbackRendered = () => {} }) => {
  const { isMobile } = useScreenSize()
  const market = useMarket()
  const withListed = market && market.allListed.length
  const withListedFinal = useRef(false)

  const [openOnMobile, setOpenOnMobile] = useState(false)
  const [filters, setFilters] = useState({})
  const [search, setSearch] = useState('')
  const [ascending, setAscending] = useState(true)
  const [sortBy, setSortBy] = useState(withListed ? 'PRICE' : 'RANK')

  useEffect(() => {
    if (!withListedFinal.current && withListed) {
      withListedFinal.current = true
      setSortBy(withListed ? 'PRICE' : 'RANK')
    }
  }, [withListed])

  const filterAssets = useCallback(
    (items) => {
      const selected = []

      Object.entries(filters).forEach(([cat, selections]) => {
        if (selections.length) {
          selected.push([cat, selections])
        }
      })

      return items.filter((asset) => {
        if (!search || (search && asset.displayName.indexOf(search) !== -1)) {
          const matchingCategories = []

          selected.forEach(([cat, selections]) => {
            let categoryMatch = false
            if (selections.includes(asset.attributes[cat])) categoryMatch = true

            if (categoryMatch) matchingCategories.push(cat)
          })

          return matchingCategories.length === selected.length
        }

        return false
      })
    },
    [search, filters]
  )

  const mapAssets = useCallback(
    (items) => {
      return items.map((asset) => {
        if (withListed) {
          const found = market.allListed.find((listed) => listed.assetId === asset.assetId)

          if (found) {
            return { ...asset, price: found.price }
          }
        }

        return { ...asset, price: 0 }
      })
    },
    [withListed]
  )

  const sortAssets = useCallback(
    (items) => {
      switch (sortBy) {
        case 'PRICE':
          const sorted = items.sort((a, b) => (ascending ? a : b).price - (ascending ? b : a).price)

          if (ascending) {
            return sorted.sort((a, b) => (a.price && b.price ? 1 : -1))
          }

          return sorted
        case 'RANK':
          return items.sort((a, b) => (ascending ? a : b).rarityRank - (ascending ? b : a).rarityRank)
        default:
          return items.sort((a, b) => (ascending ? a : b).serialNumber - (ascending ? b : a).serialNumber)
      }
    },
    [ascending, sortBy]
  )

  useEffect(() => {
    const filtered = filterAssets(assetsArr)
    const mapped = mapAssets(filtered)
    const sorted = sortAssets(mapped)

    callbackRendered(sorted)
  }, [search, filters, ascending, sortBy, withListed])

  return (
    <Fragment>
      {isMobile ? (
        <div className='flex-row' style={{ width: '95vw', justifyContent: 'space-evenly' }}>
          <TextField
            label='Search by #ID'
            placeholder='4994'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '45%' }}
          />

          <BaseButton
            label='Filters'
            onClick={() => {
              setOpenOnMobile((prev) => !prev)
              window.scrollTo({ top: 0 })
            }}
            icon={FilterIcon}
            backgroundColor='var(--brown)'
            hoverColor='var(--orange)'
            style={{ width: '45%', height: '3.5rem' }}
          />
        </div>
      ) : null}

      {!isMobile || openOnMobile ? (
        <AppBar position={isMobile ? 'absolute' : 'sticky'} className={`scroll ${styles.optionsWrapper}`}>
          {isMobile ? (
            <IconButton sx={{ margin: '0.5rem 1rem 0 auto' }} onClick={() => setOpenOnMobile((prev) => !prev)}>
              <CloseRounded color='error' />
            </IconButton>
          ) : (
            <div>
              <TextField
                label='Search by #ID'
                placeholder='4994'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
            <div className='flex-col'>
              Sort By
              <FormControl>
                <RadioGroup defaultValue={sortBy} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  {withListed ? <FormControlLabel control={<Radio />} value='PRICE' label='Price' /> : null}
                  <FormControlLabel control={<Radio />} value='RANK' label='Rank' />
                  <FormControlLabel control={<Radio />} value='ID' label='ID' />
                </RadioGroup>
              </FormControl>
            </div>

            <div className='flex-col'>
              {ascending ? 'Ascend' : 'Descend'}
              <Toggle
                labelLeft={''}
                labelRight={''}
                showIcons={false}
                state={{ value: ascending, setValue: setAscending }}
              />
            </div>
          </div>

          <div className='flex-col'>
            {traitsMatrix.map(([category, traits]) => (
              <FormControl key={`select-category-items-${category}`} sx={{ m: 0.5, width: '100%' }}>
                <InputLabel id={`select-category-items-${category}`}>{category}</InputLabel>
                <Select
                  id={`select-category-items-${category}`}
                  labelId={`select-category-items-${category}`}
                  multiple
                  value={filters[category] ?? []}
                  onChange={(e) => {
                    const value = e.target.value
                    setFilters((prev) => ({
                      ...prev,
                      [category]: typeof value === 'string' ? value.split(',') : value,
                    }))
                  }}
                  input={<OutlinedInput label={category} />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={`selected-item-${category}-${value}`} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {traits.map((obj) => {
                    const trait = obj.onChainName

                    return (
                      <MenuItem
                        key={`category-item-${category}-${trait}`}
                        value={trait}
                        sx={{ justifyContent: 'space-between' }}
                      >
                        <span>{trait}</span>
                        <span>{obj.percent}</span>
                      </MenuItem>
                    )
                  })}
                </Select>
              </FormControl>
            ))}
          </div>
        </AppBar>
      ) : null}
    </Fragment>
  )
}

export default AssetFilters
