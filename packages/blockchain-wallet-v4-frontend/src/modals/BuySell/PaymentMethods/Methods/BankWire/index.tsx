import React, { ReactElement } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { BSPaymentMethodType } from '@core/types'
import { Icon } from 'blockchain-info-components'
import { Content, Description, DisplayContainer, DisplayTitle } from 'components/BuySell'
import { Title } from 'components/Flyout'

const DisplayTitleBank = styled(DisplayTitle)`
  margin-bottom: 2px;
`

const Subtitle = styled(Title)`
  align-items: left;
  font-weight: 500;
  font-size: 14px;
  color: ${(props) => props.theme.grey600};
  margin-top: 2px;
  width: 100%;
`

const StyledDisplayContainer = styled(DisplayContainer)`
  border: solid 1px ${(props) => props.theme.grey000};
  margin: 40px 50px 16px;
  padding: 16px 24px;
  border-radius: 8px;
  width: auto;
`

const StyledContent = styled(Content)`
  margin-left: 0;
`

const Row = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`

type Props = {
  onClick: (string) => void
  text: ReactElement | string
  value: BSPaymentMethodType
}

const BankWire: React.FC<Props> = ({ onClick, text, value }) => (
  <StyledDisplayContainer
    data-e2e={`sb${value.type.toLowerCase()}BankWire`}
    role='button'
    onClick={onClick}
  >
    <Content>
      <Row>
        <StyledContent>
          <DisplayTitleBank>{text}</DisplayTitleBank>
          <Subtitle>
            <FormattedMessage
              id='modals.simplebuy.bankwire.subtitle'
              defaultMessage='Make a Deposit'
            />
          </Subtitle>
        </StyledContent>
        <Icon name='chevron-right' size='24px' color='grey400' />
      </Row>
      <Description>
        <FormattedMessage
          id='modals.simplebuy.bankwire.description_v3'
          defaultMessage="If you'd prefer to deposit funds directly from your bank account first, follow the instructions on the next screen. Once your deposit arrives in your Blockchain.com account you can come back here to buy crypto."
        />
      </Description>
    </Content>
  </StyledDisplayContainer>
)

export default BankWire
