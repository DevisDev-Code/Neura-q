import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { X, ChevronRight, Info, FileText, Lightbulb, TrendingUp } from 'lucide-react'

interface TreeNode {
  id: string
  label: string
  explanation?: string
  summary?: string
  future_scenario?: string
  children?: TreeNode[]
  _children?: TreeNode[]
  x?: number
  y?: number
  x0?: number
  y0?: number
}

interface AeonTreeVisualizationProps {
  data: TreeNode
}

const AeonTreeVisualization = ({ data }: AeonTreeVisualizationProps) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [root, setRoot] = useState<any>(null)
  const [selectedNode, setSelectedNode] = useState<any>(null)
  const [showDetailsPanel, setShowDetailsPanel] = useState(false)

  useEffect(() => {
    if (!data) {
      console.log('No data provided to AeonTreeVisualization')
      return
    }

    console.log('AeonTreeVisualization received data:', data)

    // Deep clone function
    const cloneDeep = (obj: any): any => {
      if (obj === null || typeof obj !== 'object') return obj
      if (obj instanceof Date) return new Date(obj.getTime())
      if (obj instanceof Array) return obj.map(item => cloneDeep(item))
      if (typeof obj === 'object') {
        const clonedObj: any = {}
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            clonedObj[key] = cloneDeep(obj[key])
          }
        }
        return clonedObj
      }
    }

    // Collapse function - initially collapse all children except first level
    const collapse = (d: any, level: number = 0) => {
      if (d.children && level > 0) { // Keep first level expanded
        d._children = d.children
        d._children.forEach((child: any) => collapse(child, level + 1))
        d.children = null
      } else if (d.children) {
        d.children.forEach((child: any) => collapse(child, level + 1))
      }
    }

    try {
      const hierarchyData = d3.hierarchy(cloneDeep(data)) as any
      hierarchyData.x0 = 400
      hierarchyData.y0 = 0

      // Collapse children after first level
      collapse(hierarchyData)

      setRoot(hierarchyData)
      console.log('Hierarchy created successfully:', hierarchyData)
    } catch (error) {
      console.error('Error creating hierarchy:', error)
    }
  }, [data])

  useEffect(() => {
    if (!root || !svgRef.current) return

    console.log('Starting D3 visualization with root:', root)

    const margin = { top: 20, right: showDetailsPanel ? 450 : 200, bottom: 20, left: 200 }
    const width = 1400 - margin.right - margin.left
    const height = 800 - margin.top - margin.bottom

    // Clear previous content
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    // Create main group
    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 2])
      .on('zoom', (event) => {
        g.attr('transform', `translate(${margin.left},${margin.top}) ${event.transform}`)
      })

    svg.call(zoom as any)

    // Create tree layout
    const treemap = d3.tree<TreeNode>().size([height, width])

    let i = 0
    const duration = 750

    // Tooltip functions
    const showTooltip = (event: MouseEvent, d: any) => {
      const tooltip = tooltipRef.current
      if (!tooltip) return

      let content = `<div class="font-semibold text-cyan-200 mb-2">${d.data.label}</div>`

      if (d.data.explanation) {
        content += `<div class="text-cyan-100 mb-2"><strong>Explanation:</strong><br/>${d.data.explanation}</div>`
      }

      if (d.data.summary) {
        content += `<div class="text-cyan-100 mb-2"><strong>Summary:</strong><br/>${d.data.summary}</div>`
      }

      if (d.data.future_scenario) {
        content += `<div class="text-green-200"><strong>Future Scenario:</strong><br/>${d.data.future_scenario}</div>`
      }

      tooltip.innerHTML = content
      tooltip.style.display = 'block'
      tooltip.style.left = `${event.pageX + 10}px`
      tooltip.style.top = `${event.pageY - 10}px`
    }

    const hideTooltip = () => {
      const tooltip = tooltipRef.current
      if (tooltip) {
        tooltip.style.display = 'none'
      }
    }

    // Update function
    function update(source: any) {
      console.log('Updating tree with source:', source)

      // Assigns the x and y position for the nodes
      const treeData = treemap(root)

      // Compute the new tree layout
      const nodes = treeData.descendants()
      const links = treeData.descendants().slice(1)

      // Normalize for fixed-depth - increased spacing
      nodes.forEach((d: any) => { d.y = d.depth * 250 })

      // ****************** Nodes section ***************************

      // Update the nodes...
      const node = g.selectAll('g.node')
        .data(nodes, (d: any) => d.id || (d.id = ++i))

      // Enter any new modes at the parent's previous position
      const nodeEnter = node.enter().append('g')
        .attr('class', 'node')
        .attr('transform', (_d: any) => `translate(${source.y0},${source.x0})`)
        .on('click', click)
        .on('mouseover', (event, d) => showTooltip(event, d))
        .on('mousemove', (event, d) => showTooltip(event, d))
        .on('mouseout', hideTooltip)

      // Add Circle for the nodes
      nodeEnter.append('circle')
        .attr('class', 'node-circle')
        .attr('r', 1e-6)
        .style('fill', (d: any) => {
          if (d.depth === 0) return '#0891b2' // Root - darker cyan
          if (d._children) return '#16a34a' // Has collapsed children - green
          if (d.children) return '#dc2626' // Has expanded children - red
          return '#22d3ee' // Leaf node - light cyan
        })
        .style('stroke', '#fff')
        .style('stroke-width', '2px')
        .style('cursor', 'pointer')

      // Add labels for the nodes
      nodeEnter.append('text')
        .attr('dy', '.35em')
        .attr('x', (d: any) => d.children || d._children ? -15 : 15)
        .attr('text-anchor', (d: any) => d.children || d._children ? 'end' : 'start')
        .style('fill', '#e0f2fe')
        .style('font-size', (d: any) => d.depth === 0 ? '14px' : '12px')
        .style('font-weight', (d: any) => d.depth === 0 ? 'bold' : 'normal')
        .style('cursor', 'pointer')
        .text((d: any) => {
          // Truncate long labels based on depth
          const maxLength = d.depth === 0 ? 50 : d.depth === 1 ? 40 : 35
          const label = d.data.label
          return label.length > maxLength ? label.substring(0, maxLength) + '...' : label
        })

      // UPDATE
      const nodeUpdate = nodeEnter.merge(node as any)

      // Transition to the proper position for the node
      nodeUpdate.transition()
        .duration(duration)
        .attr('transform', (d: any) => `translate(${d.y},${d.x})`)

      // Update the node attributes and style
      nodeUpdate.select('circle.node-circle')
        .attr('r', (d: any) => d.depth === 0 ? 12 : 8)
        .style('fill', (d: any) => {
          if (d.depth === 0) return '#0891b2' // Root - darker cyan
          if (d._children) return '#16a34a' // Has collapsed children - green
          if (d.children) return '#dc2626' // Has expanded children - red
          return '#22d3ee' // Leaf node - light cyan
        })
        .style('stroke', (d: any) => selectedNode && selectedNode.data.id === d.data.id ? '#fbbf24' : '#fff')
        .style('stroke-width', (d: any) => selectedNode && selectedNode.data.id === d.data.id ? '4px' : '2px')

      // Remove any exiting nodes
      const nodeExit = node.exit().transition()
        .duration(duration)
        .attr('transform', (_d: any) => `translate(${source.y},${source.x})`)
        .remove()

      // On exit reduce the node circles size to 0
      nodeExit.select('circle')
        .attr('r', 1e-6)

      // On exit reduce the opacity of text labels
      nodeExit.select('text')
        .style('fill-opacity', 1e-6)

      // ****************** links section ***************************

      // Update the links...
      const link = g.selectAll('path.link')
        .data(links, (d: any) => d.id)

      // Enter any new links at the parent's previous position
      const linkEnter = link.enter().insert('path', 'g')
        .attr('class', 'link')
        .style('fill', 'none')
        .style('stroke', '#38bdf8')
        .style('stroke-width', '2px')
        .style('opacity', 0.7)
        .attr('d', (_d: any) => {
          const o = { x: source.x0, y: source.y0 }
          return diagonal(o, o)
        })

      // UPDATE
      const linkUpdate = linkEnter.merge(link as any)

      // Transition back to the parent element position
      linkUpdate.transition()
        .duration(duration)
        .attr('d', (d: any) => diagonal(d, d.parent))

      // Remove any exiting links
      link.exit().transition()
        .duration(duration)
        .attr('d', (_d: any) => {
          const o = { x: source.x, y: source.y }
          return diagonal(o, o)
        })
        .remove()

      // Store the old positions for transition
      nodes.forEach((d: any) => {
        d.x0 = d.x
        d.y0 = d.y
      })

      // Creates a curved (diagonal) path from parent to the child nodes
      function diagonal(s: any, d: any) {
        const path = `M ${s.y} ${s.x}
                C ${(s.y + d.y) / 2} ${s.x},
                  ${(s.y + d.y) / 2} ${d.x},
                  ${d.y} ${d.x}`
        return path
      }

      // Toggle children on click and show details panel
      function click(_event: any, d: any) {
        // Set selected node and show details panel
        setSelectedNode(d)
        setShowDetailsPanel(true)

        // Toggle children expansion/collapse
        if (d.children) {
          d._children = d.children
          d.children = null
        } else {
          d.children = d._children
          d._children = null
        }
        update(d)
      }
    }

    // Start the visualization
    update(root)

  }, [root, selectedNode, showDetailsPanel])

  const closeDetailsPanel = () => {
    setShowDetailsPanel(false)
    setSelectedNode(null)
  }

  const getNodeTypeIcon = (depth: number, hasChildren: boolean, hasCollapsedChildren: boolean) => {
    if (depth === 0) return '🔵'
    if (hasCollapsedChildren) return '🟢'
    if (hasChildren) return '🔴'
    return '🔷'
  }

  const getNodeTypeLabel = (depth: number, hasChildren: boolean, hasCollapsedChildren: boolean) => {
    if (depth === 0) return 'Root Decision'
    if (hasCollapsedChildren) return 'Collapsed Branch'
    if (hasChildren) return 'Expanded Branch'
    return 'Leaf Node'
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-96 text-cyan-300">
        <div className="text-center">
          <div className="text-lg font-semibold mb-2">No Data Available</div>
          <div className="text-sm opacity-70">Please provide tree data to visualize</div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full relative flex">
      {/* Main Visualization Area */}
      <div className={`transition-all duration-300 ${showDetailsPanel ? 'w-2/3' : 'w-full'}`}>
        <div className="mb-4 text-center">
          <div className="text-sm text-cyan-300 opacity-70">
            🔵 Root | 🔴 Expanded | 🟢 Collapsed | 🔷 Leaf • Click to expand/collapse & view details • Hover for quick info • Scroll to zoom
          </div>
        </div>
        <svg
          ref={svgRef}
          width="100%"
          height={800}
          className="bg-gray-900/50 rounded-xl border border-cyan-400/20"
          style={{ cursor: 'grab' }}
        />
        {/* Tooltip */}
        <div
          ref={tooltipRef}
          className="absolute pointer-events-none z-50 bg-gray-800/95 border border-cyan-400/50 rounded-lg p-3 text-sm max-w-md shadow-2xl backdrop-blur-sm"
          style={{ display: 'none' }}
        />
      </div>

      {/* Details Panel */}
      {showDetailsPanel && selectedNode && (
        <div className="w-1/3 ml-4 bg-gradient-to-br from-cyan-950/90 to-blue-950/90 border border-cyan-400/30 rounded-xl backdrop-blur-sm overflow-hidden">
          {/* Panel Header */}
          <div className="flex items-center justify-between p-4 border-b border-cyan-400/20">
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {getNodeTypeIcon(
                  selectedNode.depth,
                  !!selectedNode.children,
                  !!selectedNode._children
                )}
              </span>
              <div>
                <h3 className="text-lg font-semibold text-cyan-200">Node Details</h3>
                <p className="text-sm text-cyan-300/70">
                  {getNodeTypeLabel(
                    selectedNode.depth,
                    !!selectedNode.children,
                    !!selectedNode._children
                  )}
                </p>
              </div>
            </div>
            <button
              onClick={closeDetailsPanel}
              className="p-2 rounded-lg hover:bg-cyan-400/10 transition-colors text-cyan-300 hover:text-cyan-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Panel Content */}
          <div className="p-4 space-y-6 max-h-[700px] overflow-y-auto">
            {/* Node Title */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-cyan-300">
                <FileText className="w-4 h-4" />
                <span className="font-medium">Title</span>
              </div>
              <div className="bg-black/20 rounded-lg p-3 border border-cyan-400/20">
                <p className="text-cyan-100 leading-relaxed">{selectedNode.data.label}</p>
              </div>
            </div>

            {/* Node ID */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-cyan-300">
                <Info className="w-4 h-4" />
                <span className="font-medium">Node ID</span>
              </div>
              <div className="bg-black/20 rounded-lg p-3 border border-cyan-400/20">
                <p className="text-cyan-100 font-mono text-sm">{selectedNode.data.id}</p>
              </div>
            </div>

            {/* Explanation */}
            {selectedNode.data.explanation && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-cyan-300">
                  <Lightbulb className="w-4 h-4" />
                  <span className="font-medium">Explanation</span>
                </div>
                <div className="bg-black/20 rounded-lg p-3 border border-cyan-400/20">
                  <p className="text-cyan-100 leading-relaxed">{selectedNode.data.explanation}</p>
                </div>
              </div>
            )}

            {/* Summary */}
            {selectedNode.data.summary && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-cyan-300">
                  <FileText className="w-4 h-4" />
                  <span className="font-medium">Summary</span>
                </div>
                <div className="bg-black/20 rounded-lg p-3 border border-cyan-400/20">
                  <p className="text-cyan-100 leading-relaxed">{selectedNode.data.summary}</p>
                </div>
              </div>
            )}

            {/* Future Scenario */}
            {selectedNode.data.future_scenario && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-green-300">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-medium">Future Scenario</span>
                </div>
                <div className="bg-green-900/20 rounded-lg p-3 border border-green-400/20">
                  <p className="text-green-100 leading-relaxed">{selectedNode.data.future_scenario}</p>
                </div>
              </div>
            )}

            {/* Node Hierarchy Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-cyan-300">
                <ChevronRight className="w-4 h-4" />
                <span className="font-medium">Hierarchy Information</span>
              </div>
              <div className="bg-black/20 rounded-lg p-3 border border-cyan-400/20 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-cyan-300">Depth Level:</span>
                  <span className="text-cyan-100">{selectedNode.depth}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-cyan-300">Has Children:</span>
                  <span className="text-cyan-100">
                    {selectedNode.children || selectedNode._children ? 'Yes' : 'No'}
                  </span>
                </div>
                {(selectedNode.children || selectedNode._children) && (
                  <div className="flex justify-between text-sm">
                    <span className="text-cyan-300">Children Count:</span>
                    <span className="text-cyan-100">
                      {(selectedNode.children || selectedNode._children)?.length || 0}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-cyan-300">Status:</span>
                  <span className="text-cyan-100">
                    {selectedNode.children ? 'Expanded' : selectedNode._children ? 'Collapsed' : 'Leaf'}
                  </span>
                </div>
              </div>
            </div>

            {/* Children List (if any) */}
            {(selectedNode.children || selectedNode._children) && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-cyan-300">
                  <ChevronRight className="w-4 h-4" />
                  <span className="font-medium">Child Nodes</span>
                </div>
                <div className="bg-black/20 rounded-lg p-3 border border-cyan-400/20">
                  <div className="space-y-2">
                    {(selectedNode.children || selectedNode._children)?.map((child: any, index: number) => (
                      <div key={child.id || index} className="flex items-start gap-2 p-2 bg-cyan-900/20 rounded border border-cyan-400/10">
                        <span className="text-cyan-400 text-sm font-mono">{child.id}</span>
                        <span className="text-cyan-100 text-sm flex-1">{child.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Raw Data (for debugging) */}
            <details className="space-y-2">
              <summary className="flex items-center gap-2 text-cyan-300 cursor-pointer hover:text-cyan-200">
                <Info className="w-4 h-4" />
                <span className="font-medium">Raw Node Data (Debug)</span>
              </summary>
              <div className="bg-black/30 rounded-lg p-3 border border-cyan-400/20">
                <pre className="text-xs text-cyan-100 overflow-x-auto">
                  {JSON.stringify(selectedNode.data, null, 2)}
                </pre>
              </div>
            </details>
          </div>
        </div>
      )}
    </div>
  )
}

export default AeonTreeVisualization