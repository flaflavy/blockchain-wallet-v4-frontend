import { ExtractSuccess, SupportedWalletCurrenciesType } from 'core/types'
import { lift } from 'ramda'
import { RootState } from 'data/rootReducer'
import Remote from 'blockchain-wallet-v4/src/remote/remote'

import {
  getFiatBalance,
  getWithdrawableFiatBalance
} from 'components/Balances/wallet/selectors'
import { OwnProps } from '.'
import { selectors } from 'data'

export const getData = (state: RootState, ownProps: OwnProps) => {
  const withdrawableBalanceR = getWithdrawableFiatBalance(
    ownProps.fiatCurrency,
    state
  )
  const availableBalanceR = getFiatBalance(ownProps.fiatCurrency, state)
  const defaultBeneficiaryR = selectors.custodial.getDefaultBeneficiary(
    ownProps.fiatCurrency,
    state
  )
  let defaultMethodR = selectors.components.brokerage.getAccount(state)
  let bankTransferAccountsR = selectors.components.brokerage.getBankTransferAccounts(
    state
  )
  // TODO: Remove this when ach deposits withdrawals gets rolled out hundo P
  const invitationsR = selectors.core.settings.getInvitations(state)
  const isInvited = invitationsR.data.achDepositWithdrawal

  if (!isInvited) {
    defaultMethodR = undefined
    bankTransferAccountsR = Remote.Success([])
  }

  const formErrors = selectors.form.getFormSyncErrors('custodyWithdrawForm')(
    state
  )
  const userDataR = selectors.modules.profile.getUserData(state)
  const minAmountR = selectors.components.withdraw.getMinAmountForCurrency(
    state,
    ownProps.fiatCurrency
  )

  const feesR = selectors.components.withdraw.getFeeForCurrency(
    state,
    ownProps.fiatCurrency
  )
  const lockR = selectors.components.withdraw.getWithdrawalLocks(state)

  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)
  const supportedCoins = supportedCoinsR.getOrElse(
    {} as SupportedWalletCurrenciesType
  )
  return lift(
    (
      bankTransferAccounts: ExtractSuccess<typeof bankTransferAccountsR>,
      withdrawableBalance: ExtractSuccess<typeof withdrawableBalanceR>,
      availableBalance: ExtractSuccess<typeof availableBalanceR>,
      defaultBeneficiary: ExtractSuccess<typeof defaultBeneficiaryR>,
      userData: ExtractSuccess<typeof userDataR>,
      minAmount: ExtractSuccess<typeof minAmountR>,
      fees: ExtractSuccess<typeof feesR>,
      locks: ExtractSuccess<typeof lockR>
    ) => ({
      bankTransferAccounts,
      withdrawableBalance,
      availableBalance,
      defaultBeneficiary,
      defaultMethod: defaultMethodR,
      formErrors,
      userData,
      minAmount,
      fees,
      locks,
      supportedCoins
    })
  )(
    bankTransferAccountsR,
    withdrawableBalanceR,
    availableBalanceR,
    defaultBeneficiaryR,
    userDataR,
    minAmountR,
    feesR,
    lockR
  )
}