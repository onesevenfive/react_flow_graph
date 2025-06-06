import { configureStore, type Middleware, type AnyAction } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

import graphReducer from './slices/graphSlice';
import type { EdgeType, NodeType } from '@/schemas';

const rootReducer = combineReducers({
    graph: graphReducer,
});

const STORAGE_KEY = 'react-flow-graph-state';

export const saveToLocalStorage = (state: { nodes: NodeType[], edges: EdgeType[] }) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
        console.error('Failed to save state to localStorage:', error);
    }
};

export const loadFromLocalStorage = (): { nodes: NodeType[], edges: EdgeType[] } | null => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : null;
    } catch (error) {
        console.error('Failed to load state from localStorage:', error);
        return null;
    }
};

const localStorageMiddleware: Middleware = (store) => (next) => (action: unknown) => {
     if (isActionWithStringType(action)) {
        const result = next(action);
        
        if (action.type.startsWith('graph/')) {
            const state = store.getState() as { graph: { nodes: NodeType[]; edges: EdgeType[] } };
            saveToLocalStorage({
                nodes: state.graph.nodes,
                edges: state.graph.edges,
            });
        }
        
        return result;
    }
    
    return next(action);
};

function isActionWithStringType(action: unknown): action is { type: string } {
    return (
        typeof action === 'object' &&
        action !== null &&
        'type' in action &&
        typeof (action as { type: unknown }).type === 'string'
    );
}

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [],
            },
        }).concat(localStorageMiddleware),
});

const savedState = loadFromLocalStorage();
if (savedState) {
    store.dispatch({ type: 'graph/initializeFromStorage', payload: savedState });
}

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;