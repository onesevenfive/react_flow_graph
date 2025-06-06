import React, {useCallback, useMemo} from 'react'

import {
    ReactFlowProvider,
    ReactFlow,
    Background,
    Panel,
    BackgroundVariant,
    type NodeChange,
    type EdgeChange,
    type Connection,
    applyNodeChanges,
    applyEdgeChanges,
    addEdge
} from "@xyflow/react";
import '@xyflow/react/dist/style.css';

import FPSCounter from "@/components/FPSCounter.tsx";
import Node from "@/components/Node.tsx";
import {useGraph} from "@/hooks";
import {type NodeType, type EdgeType, type NodeData} from "@/schemas";
import {createRandomDictionary} from "@/utils";

const MemoizedNode = React.memo(Node);

function App() {
    const {
        nodes,
        edges,
        setNodes,
        setEdges,
        clearGraph
    } = useGraph();

    const onNodesChangeInternal = useCallback((changes: NodeChange<NodeType>[]) => {
        setNodes(currentNodes => applyNodeChanges(changes, currentNodes));
    }, [setNodes]);

    const onEdgesChangeInternal = useCallback((changes: EdgeChange<EdgeType>[]) => {
        setEdges(currentEdges => applyEdgeChanges(changes, currentEdges));
    }, [setEdges]);

    const onConnect = useCallback((connection: Connection) => {
        setEdges(currentEdges => addEdge<EdgeType>(connection, currentEdges));
        
        setNodes(currentNodes => {
            const sourceNode = currentNodes.find(node => node.id === connection.source);
            const targetNode = currentNodes.find(node => node.id === connection.target);

            if (!sourceNode || !targetNode) {
                console.error("Source or target node not found for connection:", connection);
                return currentNodes;
            }

            const sourceNodeData = sourceNode.data as NodeData;
            const targetNodeData = targetNode.data as NodeData;

            return currentNodes.map(node =>
                node.id === connection.target 
                    ? {
                        ...node,
                        data: {
                            displayName: targetNodeData.displayName,
                            values: {
                                ...sourceNodeData.values,
                                ...targetNodeData.values
                            }
                        }
                    } 
                    : node
            );
        });
    }, [setEdges, setNodes]);

    const addNode = useCallback(() => {
        setNodes(currentNodes => {
            const newNode: NodeType = {
                id: (currentNodes.length + 1).toString(),
                position: {x: Math.random() * 400, y: Math.random() * 400},
                type: "custom",
                data: {
                    displayName: `Node ${currentNodes.length + 1}`,
                    values: createRandomDictionary(2)
                }
            };
            return [...currentNodes, newNode];
        });
    }, [setNodes]);
    
    const nodeTypes = useMemo(() => ({
        custom: MemoizedNode
    }), []);

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <ReactFlowProvider>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChangeInternal}
                    onEdgesChange={onEdgesChangeInternal}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    deleteKeyCode={"Delete"}
                >
                    <Panel>
                        <FPSCounter/>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <button onClick={addNode}>Add Node</button>
                            <button 
                                onClick={clearGraph}
                                style={{
                                    backgroundColor: '#ff4444',
                                    color: 'white',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#ff0000'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ff4444'}
                            >
                                Clear Graph
                            </button>
                        </div>
                    </Panel>
                    <Background variant={BackgroundVariant.Dots} gap={12} size={1}/>
                </ReactFlow>
            </ReactFlowProvider>
        </div>
    )
}

export default App;