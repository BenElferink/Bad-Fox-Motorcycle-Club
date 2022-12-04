import { Fragment } from 'react'
import { Card, CardActionArea, CardContent, Divider, Typography } from '@mui/material'
import { useScreenSize } from '../../../contexts/ScreenSizeContext.tsx'
import LoadingImage from '../../LoadingImage'

function AssetCard({
  mainTitles = [],
  subTitles = [],
  imageSrc,
  imageSizeDesktop = 300,
  imageSizeMobile = 250,
  tableRows,
  noClick = false,
  onClick,
  itemUrl = 'https://jpg.store',
  backgroundColor = 'var(--apex-charcoal)',
  color = 'var(--white)',
  style = {},
}) {
  const { isMobile } = useScreenSize()
  const imgSize = isMobile ? imageSizeMobile : imageSizeDesktop

  return (
    <Card
      sx={{
        width: imgSize,
        margin: '0.5rem',
        border: '1px solid var(--black)',
        borderRadius: '1rem',
        overflow: 'visible',
        background: backgroundColor,
        color,
        ...style,
      }}
    >
      <CardActionArea
        style={{ display: 'flex', flexDirection: 'column', cursor: noClick ? 'unset' : 'pointer' }}
        onClick={() => (noClick ? {} : onClick ? onClick() : window.open(itemUrl, '_blank'))}
      >
        {imageSrc ? (
          <LoadingImage
            width={imgSize}
            height={imgSize}
            src={imageSrc}
            alt=''
            color={color}
            style={{ borderRadius: '1rem 1rem 0 0' }}
          />
        ) : null}

        <CardContent style={{ maxWidth: 'unset', width: '100%', padding: '1rem' }}>
          <Typography variant='h5' fontSize='big'>
            {mainTitles.map((str, idx) => (
              <Fragment key={`card-string-${str}-${idx}`}>
                {str}
                {idx !== mainTitles.length - 1 ? <br /> : null}
              </Fragment>
            ))}
          </Typography>

          <Typography variant='body2' color={color ?? 'text.secondary'} fontSize='medium'>
            {subTitles.map((str, idx) => (
              <Fragment key={`card-string-${str}-${idx}`}>
                {str}
                {idx !== subTitles.length - 1 ? <br /> : null}
              </Fragment>
            ))}
          </Typography>

          {tableRows && tableRows.length ? (
            <Fragment>
              <Divider sx={{ margin: '0.5rem 0' }} />

              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {tableRows.map((row, idx) => (
                    <tr key={`${itemUrl}-table-row-${idx}`}>
                      {row.map((str) => (
                        <td key={`${itemUrl}-table-row-data-${str}-${idx}`}>
                          <Typography variant='div' color={color ?? 'text.secondary'} fontSize='smaller'>
                            {str}
                          </Typography>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Fragment>
          ) : null}
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default AssetCard
