import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import rootReducer from '../reducers';

const persistConfig = {
 key: 'root',
 storage: storage,
//  blacklist: ['recordNote', 'jobName', 'jobWage', 'jobAsFactor', 'jobNsFactor'],
 stateReconciler: autoMergeLevel2 // see "Merge Process" section for details.
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer);
export const persistor = persistStore(store);
// persistor.purge();
