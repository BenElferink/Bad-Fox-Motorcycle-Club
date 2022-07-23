import { Card, CardActionArea, CardContent, CardMedia, Divider, Typography } from '@mui/material'
import { Fragment } from 'react'

function AssetCard({
  mainTitles = [],
  subTitles = [],
  imageSrc,
  tableRows,
  onClick,
  itemUrl = 'https://jpg.store',
}) {
  return (
    <Card sx={{ margin: '1rem 2rem', borderRadius: '1rem', overflow: 'visible' }}>
      <CardActionArea
        style={{ display: 'flex', flexDirection: 'column' }}
        onClick={() => (onClick ? onClick() : window.open(itemUrl, '_blank'))}
      >
        <CardMedia
          component='img'
          image={imageSrc}
          alt=''
          sx={{ width: '300px', height: '300px', borderRadius: '1rem 1rem 0 0' }}
        />
        <CardContent style={{ maxWidth: 'unset', width: '100%' }}>
          <Typography variant='h5' fontSize='big'>
            {mainTitles.map((str, idx) => (
              <Fragment key={`card-string-${str}-${idx}`}>
                {str}
                {idx !== mainTitles.length - 1 ? <br /> : null}
              </Fragment>
            ))}
          </Typography>
          <Typography variant='body2' color='text.secondary' fontSize='medium'>
            {subTitles.map((str, idx) => (
              <Fragment key={`card-string-${str}-${idx}`}>
                {str}
                {idx !== subTitles.length - 1 ? <br /> : null}
              </Fragment>
            ))}
          </Typography>
          <Divider sx={{ margin: '0.5rem 0' }} />
          {tableRows && tableRows.length ? (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {tableRows.map((row, idx) => (
                  <tr key={`${mainTitles[0]}-table-row-${idx}`}>
                    {row.map((str) => (
                      <td key={`${mainTitles[0]}-table-row-${idx}-item-${str}`}>
                        <Typography variant='body2' color='text.secondary' fontSize='smaller'>
                          {str}
                        </Typography>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default AssetCard
