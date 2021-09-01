import { findIndex } from 'lodash-es';
import { createSelector } from 'reselect';

import { RootState } from './rematch';

export const selectTheme = (state: RootState) => state.environment.theme;
export const selectView = (state: RootState) => state.environment.view;
export const selectModal = (state: RootState) => state.environment.modal;

export const selectAccountAddress = (state: RootState) => state.account.address;
export const selectUnspentBalance = (state: RootState) => state.account.unspent?.balance;
export const selectChosenTransaction = (state: RootState) => state.account.chosenTx;
export const selectTransactions = (state: RootState) =>
  state.account.txs[state.account.address] ?? [];
// export const selectUnspentAddress = (state: RootState) => state.account.unspent?.address;
// export const selectUnspentUtxos = (state: RootState) => state.account.unspent?.utxos ?? [];
// export const selectUnspent = (state: RootState) => state.account.unspent ?? {};
// export const selectUnconfirmedTransactions = (state: RootState) =>
//   state.account?.txs[state.account?.address]?.filter(tx => tx.unconfirmed) ?? [];
export const selectTokenDetails = (state: RootState) => state.environment.tokenDetails;

export const selectChosenAsset = (state: RootState) => state.wallet.chosenAsset;
export const selectAssets = (state: RootState) => state.wallet.assets;

export const selectChosenToken = (state: RootState) => state.wallet.chosenToken;
export const selectTokenBalances = (state: RootState) => state.wallet.tokenBalances;
export const selectActiveTokenIds = (state: RootState) => Object.keys(state.wallet.tokenBalances);

export const selectTokenFilterId = (state: RootState) => state.wallet.tokenFilterId;
export const selectTokenSearchTerm = (state: RootState) => state.wallet.tokenSearchTerm;

export const selectCurrentTxId = (state: RootState) => state.wallet.currentTx.id;
export const selectCurrentTxStatus = (state: RootState) => state.wallet.currentTx.status;
export const selectCurrentTxError = (state: RootState) => state.wallet.currentTx.error;

export const selectKey = (state: RootState) => state.account.key;

// computed
export const selectAccountReady = createSelector(
  [selectAccountAddress, selectAssets, selectTransactions, selectUnspentBalance],
  (address, assets, txs, balance) =>
    assets.length > 0 &&
    address &&
    ((txs.length === 0 && balance === 0) || (txs.length > 0 && balance >= 0))
);

export const selectCurrentAsset = createSelector(
  [selectChosenAsset, selectAssets],
  (chosenAsset, assets) => {
    console.log(assets);
    const index = findIndex(assets, { name: chosenAsset });
    if (index !== -1) {
      return assets[index];
    }
    return null;
  }
);

export const selectCurrentTokenBalance = createSelector(
  [selectChosenToken, selectTokenBalances],
  (chosenToken, balances) => balances[chosenToken]
);

export const selectCurrentTokenDetail = createSelector(
  [selectChosenToken, selectTokenDetails],
  (chosenToken, details) => details[chosenToken]
);

export const selectCurrentTokenInfo = createSelector(
  [selectChosenToken, selectTokenBalances, selectTokenDetails],
  (chosenToken, balances, details) => ({ ...details[chosenToken], balance: balances[chosenToken] })
);
