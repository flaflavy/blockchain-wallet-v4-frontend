import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Switch } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { Remote } from '@core'
import { Button, Icon } from 'blockchain-info-components'
import { CardStateType } from 'data/components/debitCard/types'
import { ModalName } from 'data/modals/types'

import {
  BoxContainer,
  BoxRow,
  BoxRowItemSubTitle,
  BoxRowItemTitle,
  BoxRowWithBorder
} from '../model'

const TerminateButtonWrapper = styled(Button)`
  color: ${(props) => props.theme.red600};
`

const SwitchWrapper = styled.div`
  margin: auto;
`

const ManageCardBox = ({ cards, debitCardActions, lockHandler, modalActions }) => {
  const activeCard = cards[0]
  const [isCardLocked, setCardLocked] = useState(activeCard.status === CardStateType.LOCKED)

  const onTerminate = () => {
    modalActions.showModal(ModalName.CUSTOMIZABLE_CONFIRM_MODAL, {
      body: (
        <FormattedMessage
          id='scenes.debit_card.dashboard.confirm_terminate'
          defaultMessage='Terminate Card?'
        />
      ),
      onConfirm: () => debitCardActions.terminateCard(activeCard.id),
      origin: 'DebitCardDashboard'
    })
  }

  const toggleLock = () => {
    debitCardActions.handleCardLock({ id: activeCard.id, newLockState: !isCardLocked })
    setCardLocked(!isCardLocked)
  }

  return (
    <BoxContainer style={{ minWidth: '380px' }}>
      <BoxRowWithBorder>
        <BoxRowItemTitle>
          <FormattedMessage
            id='scenes.debit_card.dashboard.manage_card.header'
            defaultMessage='Manage Card'
          />
        </BoxRowItemTitle>
      </BoxRowWithBorder>
      <BoxRowWithBorder>
        <BoxRowItemTitle>
          <FormattedMessage
            id='scenes.debit_card.dashboard.manage_card.lock_card_title'
            defaultMessage='Lock Card'
          />
          <BoxRowItemSubTitle>
            <FormattedMessage
              id='scenes.debit_card.dashboard.manage_card.lock_card_subtitle'
              defaultMessage='Temporarily lock your card'
            />
          </BoxRowItemSubTitle>
        </BoxRowItemTitle>
        <SwitchWrapper>
          <Switch
            checked={isCardLocked}
            onClick={toggleLock}
            disabled={lockHandler === Remote.Loading}
          />
        </SwitchWrapper>
      </BoxRowWithBorder>
      <BoxRow>
        <TerminateButtonWrapper data-e2e='closeCardButton' onClick={onTerminate} fullwidth>
          <Icon name='trash' />
          <FormattedMessage
            id='scenes.debit_card.dashboard.manage_card.close_card'
            defaultMessage='Close Card'
          />
        </TerminateButtonWrapper>
      </BoxRow>
    </BoxContainer>
  )
}

export default ManageCardBox
