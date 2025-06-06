import { useCallback } from 'react';
import { useAppDispatch } from "./useAppDispatch";
import { useAppSelector } from "./useAppSelector";
import {
    setNodes as setNodesAction,
    setEdges as setEdgesAction,
    clearGraph as clearGraphAction,
} from "@/store/slices/graphSlice.ts";
import { type NodeType, type EdgeType } from "@/schemas";

export const useGraph = () => {
    const dispatch = useAppDispatch();

    const nodes = useAppSelector((state) => state.graph.nodes);
    const edges = useAppSelector((state) => state.graph.edges);

    const setNodes = useCallback((newNodes: NodeType[] | ((prev: NodeType[]) => NodeType[])) => {
        if (typeof newNodes === 'function') {
            dispatch((dispatch, getState) => {
                const currentNodes = getState().graph.nodes;
                const updatedNodes = newNodes(currentNodes);
                dispatch(setNodesAction(updatedNodes));
            });
        } else {
            dispatch(setNodesAction(newNodes));
        }
    }, [dispatch]);

    const setEdges = useCallback((newEdges: EdgeType[] | ((prev: EdgeType[]) => EdgeType[])) => {
        if (typeof newEdges === 'function') {
            dispatch((dispatch, getState) => {
                const currentEdges = getState().graph.edges;
                const updatedEdges = newEdges(currentEdges);
                dispatch(setEdgesAction(updatedEdges));
            });
        } else {
            dispatch(setEdgesAction(newEdges));
        }
    }, [dispatch]);

    const clearGraph = useCallback(() => {
        dispatch(clearGraphAction());
    }, [dispatch]);

    return {
        nodes,
        edges,
        setNodes,
        setEdges,
        clearGraph,
    };
};