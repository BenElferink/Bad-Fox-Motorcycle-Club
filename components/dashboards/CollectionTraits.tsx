import { useMemo, useState } from 'react'
import getFileForPolicyId from '../../functions/getFileForPolicyId'
import TraitCategoryFilters from '../filters/TraitCategoryFilters'
import TraitCard from '../cards/TraitCard'
import { PolicyId, TraitsFile } from '../../@types'

export interface CollectionTraitsProps {
  policyId: PolicyId
}

const CollectionTraits = (props: CollectionTraitsProps) => {
  const { policyId } = props
  const [selectedCategory, setSelectedCategory] = useState('')
  const traitsFile = useMemo(() => getFileForPolicyId(policyId, 'traits'), [policyId]) as TraitsFile

  return (
    <div>
      <TraitCategoryFilters traitsData={traitsFile} callbackSelectedCategory={(str) => setSelectedCategory(str)} />

      <div className='flex flex-row flex-wrap items-center justify-center'>
        {traitsFile[selectedCategory]?.map((trait) => (
          <TraitCard
            key={`catalog-${selectedCategory}-trait-${trait.displayName}-${trait.model}`}
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
