import React from 'react'
import { FormattedMessage } from 'react-intl'

import { NftAsset } from '@core/network/api/nfts/types'
import { Button } from 'blockchain-info-components'
import { NftOrderStepEnum } from 'data/components/nfts/types'

import { Props as OwnProps } from '../..'

const CTA: React.FC<Props> = (props) => {
  const { defaultEthAddr, nftActions } = props

  const isOwner = props.asset.owner.address.toLowerCase() === defaultEthAddr.toLowerCase()

  return isOwner ? (
    <Button
      jumbo
      nature='empty-blue'
      fullwidth
      data-e2e='sellNft'
      onClick={() => nftActions.setOrderFlowStep({ step: NftOrderStepEnum.MARK_FOR_SALE })}
    >
      <FormattedMessage id='copy.mark_for_sale' defaultMessage='Mark for Sale' />
    </Button>
  ) : null
}

type Props = OwnProps & { asset: NftAsset }

export default CTA
