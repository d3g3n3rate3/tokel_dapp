import { createModel } from '@rematch/core';
import dp from 'dot-prop-immutable';
import moment from 'moment';

import { broadcast, spend } from 'util/nspvlib';
import { spendSuccess } from 'util/transactionsHelper';
import { FEE, TICKER, TokenFilter } from 'vars/defines';

import type { RootModel } from './models';

export type Asset = {
  name: string;
  ticker?: string;
  balance?: number;
  usd_value?: number;
};

type SpendArgs = {
  address: string;
  amount: string;
};

export type TFI = typeof TokenFilter[keyof typeof TokenFilter];
export type WalletState = {
  chosenAsset?: string;
  assets: Array<Asset>;
  chosenToken?: string;
  tokenBalances: Record<string, number>;
  tokenFilterId: TFI;
  tokenSearchTerm: string;
  currentTx: {
    id: string;
    status: number;
    error: string;
  };
};

const updateCurrTx = (state: WalletState, key: string, value: unknown) => {
  return {
    ...state,
    currentTx: {
      ...state.currentTx,
      [key]: value,
    },
  };
};

export default createModel<RootModel>()({
  state: {
    chosenAsset: TICKER,
    assets: [],
    chosenToken: null,
    tokenBalances: {},
    tokenFilterId: TokenFilter.ALL,
    tokenSearchTerm: '',
    currentTx: {
      id: '',
      status: 0,
    },
  } as WalletState,
  reducers: {
    // SET_CHOSEN_ASSET: (state, chosenAsset: string) => ({ ...state, chosenAsset }),
    SET_ASSETS: (state, assets: Array<Asset>) => ({ ...state, assets }),
    UPDATE_ASSET_BALANCE: (state, asset: Asset) => {
      const indx = state.assets.findIndex(a => a.name === asset.name);
      return dp.set(state, `assets.${indx}.balance`, v => v + asset.balance);
    },
    SET_CHOSEN_TOKEN: (state, chosenToken: string) => ({ ...state, chosenToken }),
    SET_TOKEN_BALANCES: (state, tokenBalances: Record<string, number>) => ({
      ...state,
      tokenBalances,
    }),
    SET_TOKEN_FILTER_ID: (state, tokenFilterId: TFI) => ({ ...state, tokenFilterId }),
    SET_TOKEN_SEARCH_TERM: (state, tokenSearchTerm: string) => ({ ...state, tokenSearchTerm }),
    SET_CURRENT_TX_ID: (state, txid: string) => updateCurrTx(state, 'id', txid),
    SET_CURRENT_TX_STATUS: (state, txstatus: number) => updateCurrTx(state, 'status', txstatus),
    SET_CURRENT_TX_ERROR: (state, error: string) => updateCurrTx(state, 'error', error),
  },
  effects: dispatch => ({
    async spend({ address, amount }: SpendArgs, state) {
      let newTx = null;
      this.SET_CURRENT_TX_ERROR(null);
      this.SET_CURRENT_TX_ID(null);
      this.SET_CURRENT_TX_STATUS(0);
      return spend(address, amount)
        .then(res => {
          if (res.result === 'success' && res.hex) {
            this.SET_CURRENT_TX_ID(res.txid);
            newTx = res;
            return broadcast(res.hex);
          }
          return null;
        })
        .then(broadcasted => {
          if (broadcasted) {
            const success = spendSuccess(broadcasted);
            this.SET_CURRENT_TX_STATUS(Number(success));
            if (success) {
              const value = Number(amount);
              dispatch.account.ADD_NEW_TX({
                tx: newTx,
                recipient: address,
                from: [state.account.address],
                time: moment().format('DD/MM/YYYY H:mm:ss'),
                value,
                unconfirmed: true,
              });
              // update the balance after the transaction
              const updatedAsset = {
                name: TICKER,
                balance: -value - FEE,
              };
              dispatch.wallet.UPDATE_ASSET_BALANCE(updatedAsset);
            }
          }

          return null;
        })
        .catch(e => {
          this.SET_CURRENT_TX_STATUS(-1);
          this.SET_CURRENT_TX_ERROR(e.message);
          console.log(e.message);
        });
    },
  }),
});
