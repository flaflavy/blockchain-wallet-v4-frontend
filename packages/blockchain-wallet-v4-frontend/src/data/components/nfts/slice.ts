/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { string } from 'prop-types'

import { Remote } from '@core'
import {
  CollectionData,
  ExplorerGatewayNftCollectionType,
  GasCalculationOperations,
  GasDataI,
  NftAsset,
  NftAssetsType,
  NftCollection,
  NftOrder,
  NftOrdersType,
  OfferEventsType,
  OpenSeaOrder,
  OpenSeaStatus,
  RawOrder
} from '@core/network/api/nfts/types'
import { calculateGasFees } from '@core/redux/payment/nfts'
import { Await } from '@core/types'

import { NftOrderStatusEnum, NftOrderStepEnum, NftsStateType } from './types'

const initialState: NftsStateType = {
  activeTab: 'explore',
  assets: {
    atBound: false,
    collection: 'all',
    isFailure: false,
    isLoading: false,
    list: [],
    page: 0
  },
  collection: Remote.NotAsked,
  collectionSearch: [],
  collections: Remote.NotAsked,
  offersMade: {
    atBound: false,
    isFailure: false,
    isLoading: true,
    list: [],
    page: 0
  },
  openSeaAsset: Remote.NotAsked,
  openSeaOrders: Remote.NotAsked,
  openSeaStatus: Remote.NotAsked,
  orderFlow: {
    asset: Remote.NotAsked,
    fees: Remote.NotAsked,
    isSubmitting: false,
    listingToCancel: null,
    matchingOrder: Remote.NotAsked,
    offerToCancel: null,
    orderToMatch: null,
    status: null,
    step: NftOrderStepEnum.SHOW_ASSET,
    // This is a hack because sometimes opensea sets the owner address
    // to NULL_ADDRESS (if contract is opensea storefront)
    // will be fixed by explorer-gateway eventually
    walletUserIsAssetOwnerHack: false,

    wrapEthFees: Remote.NotAsked
  }
}

const nftsSlice = createSlice({
  initialState,
  name: 'nfts',
  reducers: {
    acceptOffer: (
      state,
      action: PayloadAction<{ buy: NftOrder; gasData: GasDataI; sell: NftOrder }>
    ) => {},
    cancelListing: (state, action: PayloadAction<{ gasData: GasDataI; order: RawOrder }>) => {},
    cancelOffer: (
      state,
      action: PayloadAction<{ gasData: GasDataI; order: RawOrder | null }>
    ) => {},
    clearAndRefetchAssets: (state) => {},
    clearAndRefetchOffersMade: (state) => {},
    clearAndRefetchOrders: (state) => {},
    createOffer: (
      state,
      action: PayloadAction<{
        amount?: string
        amtToWrap?: string
        asset: NftAsset
        coin?: string
        expirationTime: number
        offerFees: GasDataI
        wrapFees?: GasDataI
      }>
    ) => {},
    createOrder: (
      state,
      action: PayloadAction<{ buy: NftOrder; gasData: GasDataI; sell: NftOrder }>
    ) => {},
    createSellOrder: (
      state,
      action: PayloadAction<{
        asset: NftAssetsType[0]
        endPrice: number | null
        expirationDays: number
        gasData: GasDataI
        paymentTokenAddress: string | undefined
        startPrice: number
        waitForHighestBid: boolean | undefined
      }>
    ) => {},
    createTransfer: (
      state,
      action: PayloadAction<{
        asset: NftAssetsType[0]
        gasData: GasDataI
        to: string
      }>
    ) => {},
    fetchFees: (
      state,
      action: PayloadAction<
        | {
            operation: GasCalculationOperations.AcceptOffer
            order: NftOrder
          }
        | {
            asset: NftAsset
            offer: string
            operation: GasCalculationOperations.CreateOffer
            paymentTokenAddress: string
          }
        | {
            operation: GasCalculationOperations.Buy
            order: NftOrder
            paymentTokenAddress?: string
          }
        | {
            asset: NftAsset
            endPrice?: number
            expirationDays: number
            operation: GasCalculationOperations.Sell
            paymentTokenAddress?: string
            startPrice: number
            waitForHighestBid?: boolean
          }
        | {
            asset: NftAsset
            operation: GasCalculationOperations.Transfer
            to: string
          }
        | {
            operation: GasCalculationOperations.Cancel
            order: RawOrder
          }
      >
    ) => {},
    fetchFeesFailure: (state, action: PayloadAction<string>) => {
      state.orderFlow.fees = Remote.Failure(action.payload)
    },
    fetchFeesLoading: (state) => {
      state.orderFlow.fees = Remote.Loading
    },
    fetchFeesSuccess: (
      state,
      action: PayloadAction<Await<ReturnType<typeof calculateGasFees>>>
    ) => {
      state.orderFlow.fees = Remote.Success(action.payload)
    },
    fetchFeesWrapEth: (
      state,
      action: PayloadAction<{ operation: GasCalculationOperations.WrapEth }>
    ) => {},
    fetchFeesWrapEthFailure: (state, action: PayloadAction<string>) => {
      state.orderFlow.wrapEthFees = Remote.Failure(action.payload)
    },
    fetchFeesWrapEthLoading: (state) => {
      state.orderFlow.wrapEthFees = Remote.Loading
    },
    fetchFeesWrapEthSuccess: (
      state,
      action: PayloadAction<Await<ReturnType<typeof calculateGasFees>>>
    ) => {
      state.orderFlow.wrapEthFees = Remote.Success(action.payload)
    },
    fetchMatchingOrder: (state) => {},
    fetchMatchingOrderFailure: (state, action: PayloadAction<string>) => {
      state.orderFlow.matchingOrder = Remote.Failure(action.payload)
    },
    fetchMatchingOrderLoading: (state) => {
      state.orderFlow.matchingOrder = Remote.Loading
    },
    fetchMatchingOrderSuccess: (
      state,
      action: PayloadAction<{ buy: NftOrder; sell: NftOrder }>
    ) => {
      state.orderFlow.matchingOrder = Remote.Success(action.payload)
    },
    fetchNftCollections: (
      state,
      action: PayloadAction<{
        direction?: 'ASC' | 'DESC'
        sortBy?: keyof ExplorerGatewayNftCollectionType
      }>
    ) => {},
    fetchNftCollectionsFailure: (state, action: PayloadAction<string>) => {
      state.collections = Remote.Failure(action.payload)
    },
    fetchNftCollectionsLoading: (state) => {
      state.collections = Remote.Loading
    },
    fetchNftCollectionsSuccess: (
      state,
      action: PayloadAction<ExplorerGatewayNftCollectionType[]>
    ) => {
      state.collections = Remote.Success(action.payload)
    },
    fetchNftOffersMade: () => {},
    fetchNftOffersMadeFailure: (state, action: PayloadAction<string>) => {
      state.offersMade.isFailure = true
    },
    fetchNftOffersMadeLoading: (state) => {
      state.offersMade.isLoading = true
    },
    fetchNftOffersMadeSuccess: (state, action: PayloadAction<OfferEventsType['asset_events']>) => {
      state.offersMade.isFailure = false
      state.offersMade.isLoading = false
      state.offersMade.list = [...state.offersMade.list, ...action.payload]
    },
    fetchNftOrderAsset: () => {},
    fetchNftOrderAssetFailure: (state, action: PayloadAction<string>) => {
      state.orderFlow.asset = Remote.Failure(action.payload)
    },
    fetchNftOrderAssetLoading: (state) => {
      state.orderFlow.asset = Remote.Loading
    },
    fetchNftOrderAssetSuccess: (state, action: PayloadAction<NftAsset>) => {
      state.orderFlow.asset = Remote.Success(action.payload)
    },
    fetchOpenSeaOrders: (
      state,
      action: PayloadAction<{ asset_contract_address: string; token_id: string }>
    ) => {},
    fetchOpenSeaOrdersFailure: (state, action: PayloadAction<string>) => {
      state.openSeaOrders = Remote.Failure(action.payload)
    },
    fetchOpenSeaOrdersLoading: (state) => {
      state.openSeaOrders = Remote.Loading
    },
    fetchOpenSeaOrdersSuccess: (state, action: PayloadAction<OpenSeaOrder[]>) => {
      state.openSeaOrders = Remote.Success(action.payload)
    },
    fetchOpenseaAsset: (
      state,
      action: PayloadAction<{
        asset_contract_address: string
        token_id: string
      }>
    ) => {},
    fetchOpenseaAssetFailure: (state, action: PayloadAction<NftAsset>) => {
      state.openSeaAsset = Remote.Failure(action.payload)
    },
    fetchOpenseaAssetLoading: (state) => {
      state.openSeaAsset = Remote.Loading
    },
    fetchOpenseaAssetSuccess: (state, action: PayloadAction<NftAsset>) => {
      state.openSeaAsset = Remote.Success(action.payload)
    },
    fetchOpenseaStatus: () => {},
    fetchOpenseaStatusFailure: (state, action: PayloadAction<OpenSeaStatus>) => {
      state.openSeaStatus = Remote.Failure(action.payload)
    },
    fetchOpenseaStatusLoading: (state) => {
      state.openSeaStatus = Remote.Loading
    },
    fetchOpenseaStatusSuccess: (state, action: PayloadAction<OpenSeaStatus>) => {
      state.openSeaStatus = Remote.Success(action.payload)
    },
    nftOrderFlowClose: (state) => {
      state.orderFlow.step = NftOrderStepEnum.SHOW_ASSET
      state.orderFlow.walletUserIsAssetOwnerHack = false

      state.orderFlow.isSubmitting = false

      state.orderFlow.offerToCancel = null
      state.orderFlow.listingToCancel = null
      state.orderFlow.orderToMatch = null
      state.orderFlow.matchingOrder = Remote.NotAsked
      state.orderFlow.asset = Remote.NotAsked
      state.orderFlow.fees = Remote.NotAsked
      state.orderFlow.wrapEthFees = Remote.NotAsked
    },
    nftOrderFlowOpen: (
      state,
      action: PayloadAction<
        | {
            asset_contract_address: string
            offer: OfferEventsType['asset_events'][0]
            order?: never
            step: NftOrderStepEnum.CANCEL_OFFER
            token_id: string
            walletUserIsAssetOwnerHack: boolean
          }
        | {
            asset_contract_address: string
            offer?: never
            order: RawOrder
            step: NftOrderStepEnum.BUY
            token_id: string
            walletUserIsAssetOwnerHack: boolean
          }
        | {
            asset_contract_address: string
            offer?: never
            order?: never
            step: NftOrderStepEnum
            token_id: string
            walletUserIsAssetOwnerHack: boolean
          }
      >
    ) => {
      state.orderFlow.asset = Remote.Loading
      state.orderFlow.step = action.payload.step
      state.orderFlow.walletUserIsAssetOwnerHack = action.payload.walletUserIsAssetOwnerHack

      if (action.payload.order) {
        state.orderFlow.orderToMatch = action.payload.order
      }
    },
    resetNftAssets: (state) => {
      state.assets.atBound = false
      state.assets.page = 0
      state.assets.isLoading = false
      state.assets.list = []
    },
    resetNftFees: (state) => {
      state.orderFlow.fees = Remote.NotAsked
    },
    resetNftOffersMade: (state) => {
      state.offersMade.atBound = false
      state.offersMade.page = 0
      state.offersMade.isFailure = false
      state.offersMade.isLoading = true
      state.offersMade.list = []
    },
    searchNftAssetContract: (
      state,
      action: PayloadAction<{ asset_contract_address?: string; search?: string }>
    ) => {},
    setActiveSlug: (state, action: PayloadAction<{ slug: string }>) => {
      state.activeSlug = action.payload.slug
    },
    setAssetBounds: (state, action: PayloadAction<{ atBound: boolean }>) => {
      state.assets.atBound = action.payload.atBound
    },
    setAssetData: (state, action: PayloadAction<{ collection?: string; page?: number }>) => {
      state.assets.collection = action.payload.collection || 'all'
      state.assets.page = action.payload.page || 0
    },
    setCollectionSearch: (state, action: PayloadAction<ExplorerGatewayNftCollectionType[]>) => {
      state.collectionSearch = action.payload
    },
    setListingToCancel: (state, action: PayloadAction<{ order: RawOrder }>) => {
      state.orderFlow.listingToCancel = action.payload.order
    },
    setNftOrderStatus: (state, action: PayloadAction<NftOrderStatusEnum>) => {
      state.orderFlow.status = action.payload
    },
    setOfferToCancel: (state, action: PayloadAction<{ offer: RawOrder }>) => {
      state.orderFlow.offerToCancel = action.payload.offer
    },
    setOffersMadeBounds: (state, action: PayloadAction<{ atBound: boolean }>) => {
      state.offersMade.atBound = action.payload.atBound
    },
    setOffersMadeData: (state, action: PayloadAction<{ page?: number }>) => {
      state.offersMade.page = action.payload.page || 0
    },
    setOrderFlowIsSubmitting: (state, action: PayloadAction<boolean>) => {
      state.orderFlow.isSubmitting = action.payload
    },
    setOrderFlowStep: (state, action: PayloadAction<{ step: NftOrderStepEnum }>) => {
      state.orderFlow.step = action.payload.step
    },
    setOrderToMatch: (state, action: PayloadAction<{ order: RawOrder }>) => {
      state.orderFlow.orderToMatch = action.payload.order
    }
  }
})

const { actions } = nftsSlice
const nftsReducer = nftsSlice.reducer
export { actions, nftsReducer }
