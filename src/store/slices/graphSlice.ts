import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type NodeType, type EdgeType } from "@/schemas";

interface InitialState {
    nodes: NodeType[];
    edges: EdgeType[];
}

const initialState: InitialState = {
    nodes: [],
    edges: [],
};

const graphSlice = createSlice({
    name: 'graph',
    initialState,
    reducers: {
        setNodes: (state, action: PayloadAction<NodeType[]>) => {
            state.nodes = action.payload;
        },
        setEdges: (state, action: PayloadAction<EdgeType[]>) => {
            state.edges = action.payload;
        },
        clearGraph: (state) => {
            state.nodes = [];
            state.edges = [];
        },
        initializeFromStorage: (state, action: PayloadAction<InitialState>) => {
            state.nodes = action.payload.nodes;
            state.edges = action.payload.edges;
        },
    },
});

export const {
    setNodes,
    setEdges,
    clearGraph,
    initializeFromStorage,
} = graphSlice.actions;

export default graphSlice.reducer;