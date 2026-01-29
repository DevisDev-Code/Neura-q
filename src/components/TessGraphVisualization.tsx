import React, { useState, useCallback, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  ConnectionMode,
  Panel,
  ReactFlowProvider,
  Handle,
  Position
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Target, TrendingUp } from 'lucide-react';

interface TessGraphVisualizationProps {
  data: any;
  onNodeSelect?: (node: any) => void;
  selectedNode?: any;
  showRecommendedOnly?: boolean;
}

// Custom Node Component with improved visibility and centered text
const CustomNode = ({ data, selected }: { data: any; selected: boolean }) => {
  const { nodeData, isRecommended } = data;

  // Enhanced color mapping with better contrast - aligned with backend
  const getNodeColors = (colorCode: string, isRecommended = false, isSelected = false) => {
    const baseColors: { [key: string]: any } = {
      "high": {
        headerBg: "#10B981",
        bodyBg: isSelected ? "#047857" : "#065F46",
        textColor: "#FFFFFF",
        border: "#10B981"
      },
      "medium": {
        headerBg: "#F59E0B",
        bodyBg: isSelected ? "#B45309" : "#92400E",
        textColor: "#FFFFFF",
        border: "#F59E0B"
      },
      "low": {
        headerBg: "#EF4444",
        bodyBg: isSelected ? "#B91C1C" : "#991B1B",
        textColor: "#FFFFFF",
        border: "#EF4444"
      }
    };

    const colors = baseColors[colorCode] || baseColors["low"];

    return {
      headerBg: colors.headerBg,
      bodyBg: colors.bodyBg,
      borderColor: isRecommended ? "#FBBF24" : colors.border,
      textColor: colors.textColor,
      borderWidth: isRecommended ? 3 : 2
    };
  };

  const colors = getNodeColors(nodeData.color, isRecommended, selected);

  // Get score emoji based on score value
  const getScoreEmoji = (score: number) => {
    if (score >= 0.8) return '🟢';
    if (score >= 0.6) return '🟡';
    return '🔴';
  };

  return (
    <div
      className="rounded-xl shadow-2xl cursor-pointer transition-all duration-200 hover:scale-105 min-w-[220px] max-w-[260px] overflow-hidden"
      style={{
        borderColor: colors.borderColor,
        borderWidth: colors.borderWidth,
        borderStyle: 'solid',
        boxShadow: isRecommended
          ? '0 0 20px rgba(251, 191, 36, 0.4), 0 8px 32px rgba(0, 0, 0, 0.3)'
          : '0 8px 32px rgba(0, 0, 0, 0.3)'
      }}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-orange-400 border-2 border-white" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-orange-400 border-2 border-white" />

      {/* FIXED: Top Bar Header with proper layout - emoji left, ID center, percentage right */}
      <div
        className="flex items-center justify-between px-3 py-2 h-10"
        style={{ backgroundColor: colors.headerBg }}
      >
        {/* Left side - Score emoji */}
        <div className="flex items-center justify-center w-6">
          <span className="text-sm leading-none">
            {getScoreEmoji(nodeData.score)}
          </span>
        </div>

        {/* Center - Node ID */}
        <div className="flex-1 flex items-center justify-center">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              color: '#FFFFFF'
            }}
          >
            {nodeData.id}
          </div>
        </div>

        {/* Right side - Percentage score */}
        <div className="flex items-center justify-center w-6">
          <span className="text-xs font-bold leading-none" style={{ color: '#FFFFFF' }}>
            {Math.round(nodeData.score * 100)}%
          </span>
        </div>
      </div>

      {/* Main Content Area with centered text */}
      <div
        className="px-3 py-3"
        style={{
          backgroundColor: colors.bodyBg,
          color: colors.textColor
        }}
      >
        <div className="text-sm font-medium leading-tight text-center" style={{ color: colors.textColor }}>
          {nodeData.label.length > 90 ? `${nodeData.label.substring(0, 90)}...` : nodeData.label}
        </div>

        {/* Recommended Badge */}
        {isRecommended && (
          <div className="mt-2 text-center">
            <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full font-medium">
              ⭐ Recommended
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const TessGraphVisualization: React.FC<TessGraphVisualizationProps> = ({
  data,
  onNodeSelect,
  selectedNode,
  showRecommendedOnly = false
}) => {
  // Tooltip state for working hover functionality
  const [tooltipData, setTooltipData] = useState<{ node: any, x: number, y: number } | null>(null);

  // Safely access data with fallbacks
  const nodes = data?.result?.nodes || [];
  const edges = data?.result?.edges || []; // Changed from links to edges to match backend
  const recommendedPath = data?.result?.recommendedPath || [];

  // Node types
  const nodeTypes = useMemo(() => ({
    custom: CustomNode,
  }), []);

  // Generate nodes for React Flow with improved spacing
  const flowNodes = useMemo(() => {
    const filteredNodes = showRecommendedOnly
      ? nodes.filter((node: any) => recommendedPath.includes(node.id))
      : nodes;

    if (filteredNodes.length === 0) return [];

    return filteredNodes.map((node: any, index: number) => {
      const isRecommended = recommendedPath.includes(node.id);

      // Improved layout with better spacing
      const cols = Math.min(4, Math.ceil(Math.sqrt(filteredNodes.length)));
      const row = Math.floor(index / cols);
      const col = index % cols;

      // Increased spacing for better readability
      const xOffset = (row % 2) * 100;
      const ySpacing = 300;
      const xSpacing = 340;

      return {
        id: node.id,
        type: 'custom',
        position: {
          x: col * xSpacing + xOffset,
          y: row * ySpacing + 50
        },
        data: {
          nodeData: node,
          isRecommended: isRecommended
        },
        selected: selectedNode?.id === node.id
      };
    });
  }, [nodes, selectedNode, showRecommendedOnly, recommendedPath]);

  // Generate edges with much better visibility
  const flowEdges = useMemo(() => {
    const filteredEdges = showRecommendedOnly
      ? edges.filter((edge: any) =>
        recommendedPath.includes(edge.source) &&
        recommendedPath.includes(edge.target)
      )
      : edges;

    return filteredEdges.map((edge: any) => {
      const isRecommendedPath = recommendedPath.includes(edge.source) &&
        recommendedPath.includes(edge.target);

      return {
        id: `${edge.source} -${edge.target} `,
        source: edge.source,
        target: edge.target,
        type: 'smoothstep',
        animated: isRecommendedPath,
        style: {
          stroke: isRecommendedPath ? '#FBBF24' : '#F97316',
          strokeWidth: isRecommendedPath ? 4 : 3,
          strokeDasharray: edge.strength === 'low' ? '8,4' : 'none',
          filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.5))'
        },
        markerEnd: {
          type: 'arrowclosed',
          color: isRecommendedPath ? '#FBBF24' : '#F97316',
        },
        label: edge.label || ''
      };
    });
  }, [edges, showRecommendedOnly, recommendedPath]);

  const [reactFlowNodes, setNodes, onNodesChange] = useNodesState(flowNodes);
  const [reactFlowEdges, setEdges, onEdgesChange] = useEdgesState(flowEdges);

  // Update nodes and edges when data changes
  React.useEffect(() => {
    setNodes(flowNodes);
    setEdges(flowEdges);
  }, [flowNodes, flowEdges, setNodes, setEdges]);

  // Handle node click
  const onNodeClick = useCallback((_event: any, node: any) => {
    const originalNode = nodes.find((n: any) => n.id === node.id);
    if (originalNode && onNodeSelect) {
      onNodeSelect(originalNode);
    }
  }, [nodes, onNodeSelect]);

  // Better tooltip positioning
  const onNodeMouseEnter = useCallback((event: any, node: any) => {
    const originalNode = nodes.find((n: any) => n.id === node.id);
    if (originalNode) {
      const rect = event.currentTarget.getBoundingClientRect();
      setTooltipData({
        node: originalNode,
        x: rect.right + 10,
        y: rect.top - 10
      });
    }
  }, [nodes]);

  const onNodeMouseLeave = useCallback(() => {
    setTooltipData(null);
  }, []);

  if (nodes.length === 0) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-gradient-to-br from-orange-950/90 to-red-950/90 rounded-lg border-2 border-orange-400/30">
        <div className="text-center">
          <div className="text-4xl mb-4">📊</div>
          <p className="text-orange-200 text-lg">No graph data available</p>
          <p className="text-orange-300/70 text-sm">Waiting for backend data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] relative max-w-full overflow-hidden min-w-0">
      <ReactFlowProvider>
        <ReactFlow
          nodes={reactFlowNodes}
          edges={reactFlowEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onNodeMouseEnter={onNodeMouseEnter}
          onNodeMouseLeave={onNodeMouseLeave}
          nodeTypes={nodeTypes}
          connectionMode={ConnectionMode.Loose}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          attributionPosition="bottom-left"
          className="w-full h-full bg-gradient-to-br from-orange-950/90 to-red-950/90"
          minZoom={0.1}
          maxZoom={2}
        >
          <Background
            color="rgba(251, 146, 60, 0.3)"
            gap={30}
            size={2}
            style={{
              backgroundColor: 'transparent'
            }}
          />

          <Controls
            className="bg-orange-950/90 border-orange-400/30 text-orange-200"
          />

          <MiniMap
            nodeColor={(node) => {
              const isRecommended = recommendedPath.includes(node.id);
              return isRecommended ? '#FBBF24' : '#F97316';
            }}
            nodeStrokeWidth={2}
            pannable
            zoomable
            className="bg-orange-950/90 border border-orange-400/30 rounded-lg"
            style={{
              backgroundColor: 'rgba(154, 52, 18, 0.9)'
            }}
          />

          <Panel position="top-left" className="bg-gradient-to-br from-orange-950/95 to-red-950/95 border border-orange-400/40 backdrop-blur-sm text-white p-4 rounded-lg shadow-2xl z-40">
            <h4 className="font-semibold text-orange-200 mb-3 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Legend
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded shadow-sm"></div>
                <span className="text-orange-100">High Score (80%+)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded shadow-sm"></div>
                <span className="text-orange-100">Medium Score (60-79%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded shadow-sm"></div>
                <span className="text-orange-100">Low Score (under 60%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-yellow-400 rounded shadow-sm"></div>
                <span className="text-orange-100">⭐ Recommended Path</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-1 bg-orange-400 rounded shadow-sm"></div>
                <span className="text-orange-100">Connection Lines</span>
              </div>
            </div>
          </Panel>

          <Panel position="top-right" className="bg-gradient-to-br from-orange-950/95 to-red-950/95 border border-orange-400/40 backdrop-blur-sm text-white p-4 rounded-lg shadow-2xl z-40 mt-4">
            <h4 className="font-semibold text-orange-200 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Graph Stats
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-orange-100">Total Nodes:</span>
                <span className="font-medium text-white">{reactFlowNodes.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-orange-100">Total Edges:</span>
                <span className="font-medium text-white">{reactFlowEdges.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-orange-100">Recommended Path:</span>
                <span className="font-medium text-yellow-300">{recommendedPath.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-orange-100">High Score Nodes:</span>
                <span className="font-medium text-green-400">
                  {nodes.filter((n: any) => n.score >= 0.8).length}
                </span>
              </div>
            </div>
          </Panel>
        </ReactFlow>
      </ReactFlowProvider>

      {/* Enhanced tooltip with better visibility */}
      {tooltipData && (
        <div
          className="fixed bg-gradient-to-br from-orange-950/98 to-red-950/98 border border-orange-400/50 backdrop-blur-sm text-white px-4 py-3 rounded-lg shadow-2xl z-50 pointer-events-none max-w-xs"
          style={{
            left: `${Math.min(tooltipData.x, window.innerWidth - 300)}px`,
            top: `${Math.max(tooltipData.y, 10)}px`,
          }}
        >
          <div className="font-semibold mb-1 text-orange-200">{tooltipData.node.label}</div>
          <div className="text-orange-100 text-sm">Score: {Math.round(tooltipData.node.score * 100)}%</div>
          {tooltipData.node.reasoning && (
            <div className="text-orange-200/80 text-xs mt-1 line-clamp-3">
              {tooltipData.node.reasoning.substring(0, 100)}...
            </div>
          )}
        </div>
      )}

      {/* Enhanced instructions with better styling */}
      <div className="absolute bottom-4 right-4 z-10">
        <div className="bg-gradient-to-br from-orange-950/95 to-red-950/95 border border-orange-400/40 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-orange-100 shadow-lg">
          🔍 Drag to pan • Scroll/pinch to zoom • Hover nodes for details • Click to select
        </div>
      </div>
    </div>
  );
};

export default TessGraphVisualization;