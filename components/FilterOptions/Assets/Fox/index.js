import React, { Fragment, useEffect, useState } from 'react'
import { Box, Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select, TextField } from '@mui/material'
import { TuneRounded as FilterIcon } from '@mui/icons-material'
import { useScreenSize } from '../../../../contexts/ScreenSizeContext'
import traitsData from '../../../../data/traits/fox'
import Modal from '../../../Modal'
import Toggle from '../../../Toggle'
import BaseButton from '../../../BaseButton'
import styles from './FoxAssetsOptions.module.css'

const TRAITS_MATRIX = Object.entries(traitsData).sort((a, b) => a[0].localeCompare(b[0]))

const FoxAssetsOptions = ({
  defaultAscending = true,
  defaultSortByRank = false,
  defaultSearch = '',
  defaultFilters = (() => {
    const payload = {}

    TRAITS_MATRIX.forEach(([cat]) => {
      payload[cat] = []
    })

    return payload
  })(),
  callbackAscending = () => {},
  callbackSortByRank = () => {},
  callbackSearch = () => {},
  callbackFilters = () => {},
  noRankText = 'Price',
}) => {
  const { isMobile } = useScreenSize()

  const [openFilters, setOpenFilters] = useState(false)

  const [ascending, setAscending] = useState(defaultAscending)
  const [sortByRank, setSortByRank] = useState(defaultSortByRank)
  const [search, setSearch] = useState(defaultSearch)
  const [filters, setFilters] = useState(defaultFilters)

  useEffect(() => {
    callbackAscending(ascending)
  }, [ascending])

  useEffect(() => {
    callbackSortByRank(sortByRank)
  }, [sortByRank])

  useEffect(() => {
    callbackSearch(search)
  }, [search])

  useEffect(() => {
    callbackFilters(filters)
  }, [filters])

  return (
    <Fragment>
      <div className={styles.optionsWrapper}>
        <div className={styles.togglesWrapper}>
          <div className='flex-col'>
            {!isMobile ? (ascending ? 'Ascend' : 'Descend') : null}
            <Toggle
              labelLeft={isMobile ? 'Descend' : ''}
              labelRight={isMobile ? 'Ascend' : ''}
              showIcons={false}
              state={{ value: ascending, setValue: setAscending }}
              style={{ margin: isMobile ? '0.5rem 0.3rem' : '0 0.3rem' }}
            />
          </div>
          <div className='flex-col'>
            {!isMobile ? (!sortByRank ? noRankText : 'Rank') : null}
            <Toggle
              labelLeft={isMobile ? 'Rank' : ''}
              labelRight={isMobile ? noRankText : ''}
              showIcons={false}
              state={{ value: sortByRank, setValue: setSortByRank }}
              style={{ margin: isMobile ? '0.5rem 0.3rem' : '0 0.3rem' }}
            />
          </div>
        </div>

        <div>
          <BaseButton
            label='Filter Attributes'
            onClick={() => setOpenFilters((prev) => !prev)}
            icon={FilterIcon}
            style={{
              width: 'calc(60% - 0.5rem)',
              marginRight: '0.5rem',
            }}
            backgroundColor='var(--brown)'
            hoverColor='var(--orange)'
          />
          <TextField
            label='Search by #ID'
            placeholder='4994'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '40%' }}
          />
        </div>
      </div>

      <Modal title='Filter Attributes' open={openFilters} onClose={() => setOpenFilters((prev) => !prev)}>
        <div className={styles.listOfFilters}>
          {TRAITS_MATRIX.map(([category, traits], idx1) => (
            <div key={`market-category-${category}-${idx1}`}>
              <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id={`select-category-items-${category}-label`}>{category}</InputLabel>
                <Select
                  id={`select-category-items-${category}`}
                  labelId={`select-category-items-${category}-label`}
                  multiple
                  value={filters[category]}
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
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {traits.map((obj, idx2) => {
                    const trait =
                      category === 'Gender'
                        ? obj.label
                        : `${
                            obj.gender === 'Male'
                              ? '(M) '
                              : obj.gender === 'Female'
                              ? '(F) '
                              : obj.gender === 'Unisex'
                              ? '(U) '
                              : ''
                          }${obj.label}`

                    return (
                      <MenuItem
                        key={`market-category-attribute-${obj.label}-${idx2}`}
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
            </div>
          ))}
        </div>
      </Modal>
    </Fragment>
  )
}

export default FoxAssetsOptions
