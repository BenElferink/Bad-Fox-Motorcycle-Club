import { useEffect, useMemo, useState } from 'react'
import getFileForPolicyId from '../../functions/getFileForPolicyId'
import TraitCategoryFilters from '../filters/TraitCategoryFilters'
import TraitCard from '../cards/TraitCard'
import { PolicyId, TraitsFile } from '../../@types'

export interface CollectionTraitsProps {
  policyId: PolicyId
}

const CollectionTraits = (props: CollectionTraitsProps) => {
  const { policyId } = props
  const [selectedCategory, setSelectedCategory] = useState('Skin')
  const traitsFile = useMemo(() => getFileForPolicyId(policyId, 'traits'), [policyId]) as TraitsFile

  useEffect(() => {
    setSelectedCategory('Skin')
  }, [policyId])

  return (
    <div>
      <TraitCategoryFilters
        traitsData={traitsFile}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <div className='flex flex-row flex-wrap items-center justify-center'>
        {traitsFile[selectedCategory]?.map((trait) => (
          <TraitCard
            key={`catalog-${policyId}-category-${selectedCategory}-trait-${trait.displayName}-model-${trait.model}`}
            imageSrc={trait.image}
            title={trait.displayName}
            tableRows={[
              ['Model:', 'Count:', 'Percent:'],
              [trait.model, trait.count.toString(), trait.percent],
            ]}
          />
        ))}
      </div>
    </div>
  )
}

export default CollectionTraits
