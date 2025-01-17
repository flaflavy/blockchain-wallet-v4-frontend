import React from 'react'
import { FormattedMessage } from 'react-intl'

import { CellHeaderText, CellText } from 'components/Table'

export const getFloorPriceColumn = () => ({
  Cell: ({ row: { original: values } }) => {
    return <CellText>{values.floor_price || '--'} ETH</CellText>
  },
  Header: () => (
    <CellHeaderText>
      <FormattedMessage id='copy.floor_price' defaultMessage='Floor Price' />
    </CellHeaderText>
  ),
  accessor: 'floor_price',
  disableGlobalFilter: true
})
