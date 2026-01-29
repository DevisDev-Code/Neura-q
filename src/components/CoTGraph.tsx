import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

type Result = {
  steps: { id: string; thought: string; explanation: string }[];
  benefits: string[];
  consequences: string[];
  final_thought: string;
  alternative_paths: { id: string; description: string }[];
  recommended_path_id: string;
};

type Node = {
  id: string;
  label: string;
  type: 'step' | 'benefit' | 'consequence' | 'alternative' | 'final';
  x?: number;
  y?: number;
};

type Link = {
  source: string;
  target: string;
};

const width = 1000;
const height = 800;

// Move getNodeRadius function to the top level to avoid hoisting issues
const getNodeRadius = (type?: string): number => {
  const radiusByType: Record<string, number> = {
    step: 40,
    benefit: 35,
    consequence: 35,
    alternative: 30,
    final: 55,
  };
  return radiusByType[type || 'step'] || 35;
};

function CoTGraphVisualization({ result }: { result: Result }) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!result) {
      console.log('No result provided to CoTGraphVisualization');
      return;
    }

    console.log('CoTGraphVisualization received result:', result);

    // Defensive validation
    if (!Array.isArray(result.steps)) {
      console.error('Steps is not an array:', result.steps);
      return;
    }

    if (result.steps.length === 0) {
      console.warn('Empty steps array, will show minimal visualization');
    }

    if (!result.final_thought) {
      console.error('Missing final_thought');
      return;
    }

    // Prepare nodes with improved positioning logic
    const stepNodes: Node[] = result.steps.map((step, index) => {
      if (!step.id || !step.thought) {
        console.warn('Invalid step detected:', step);
      }
      return {
        id: `step-${step.id || index}`,
        label: step.thought || 'No thought',
        type: 'step' as const,
      };
    });

    const benefitNodes: Node[] = Array.isArray(result.benefits)
      ? result.benefits.map((b, i) => ({
        id: `benefit-${i}`,
        label: b || 'No benefit',
        type: 'benefit' as const,
      }))
      : [];

    const consequenceNodes: Node[] = Array.isArray(result.consequences)
      ? result.consequences.map((c, i) => ({
        id: `consequence-${i}`,
        label: c || 'No consequence',
        type: 'consequence' as const,
      }))
      : [];

    const altNodes: Node[] = Array.isArray(result.alternative_paths)
      ? result.alternative_paths.map((alt, i) => ({
        id: `alt-${alt.id || i}`,
        label: alt.description || 'No description',
        type: 'alternative' as const,
      }))
      : [];

    // Final center node
    const centerNode: Node = {
      id: 'center',
      label: result.final_thought,
      type: 'final' as const,
    };

    // All nodes combined
    const nodes: Node[] = [
      ...stepNodes,
      ...benefitNodes,
      ...consequenceNodes,
      ...altNodes,
      centerNode,
    ];

    if (nodes.length === 0) {
      console.error('No nodes to display');
      return;
    }

    console.log('Total nodes created:', nodes.length);

    // Validate all nodes have types
    nodes.forEach((node, index) => {
      if (!node.type) {
        console.error(`Node at index ${index} missing type:`, node);
        node.type = 'step';
      }
    });

    // Enhanced Links with better flow
    const stepLinks: Link[] = [];
    for (let i = 0; i < stepNodes.length - 1; i++) {
      stepLinks.push({
        source: stepNodes[i].id,
        target: stepNodes[i + 1].id,
      });
    }

    // Connect last step to center if steps exist
    if (stepNodes.length > 0) {
      stepLinks.push({
        source: stepNodes[stepNodes.length - 1].id,
        target: centerNode.id,
      });
    }

    const benefitLinks: Link[] = benefitNodes.map((b) => ({
      source: b.id,
      target: centerNode.id,
    }));

    const consequenceLinks: Link[] = consequenceNodes.map((c) => ({
      source: c.id,
      target: centerNode.id,
    }));

    const altLinks: Link[] = altNodes.map((a) => ({
      source: a.id,
      target: centerNode.id,
    }));

    const links: Link[] = [
      ...stepLinks,
      ...benefitLinks,
      ...consequenceLinks,
      ...altLinks,
    ];

    // Clear previous svg content
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Enhanced zoom behavior with smooth scrolling
    const zoom = d3.zoom()
      .scaleExtent([0.2, 5])
      .on('zoom', (event) => {
        container.attr('transform', event.transform);
      });

    // Apply zoom to SVG with wheel event handling
    svg.call(zoom as any)
      .on('wheel.zoom', (event) => {
        event.preventDefault();
        const scaleFactor = event.deltaY > 0 ? 0.9 : 1.1;
        svg.transition()
          .duration(100)
          .call(zoom.scaleBy as any, scaleFactor);
      });

    // Create main container for all graph elements
    const container = svg.append('g');

    // Enhanced simulation with better forces for beautiful alignment
    const simulation = d3
      .forceSimulation(nodes as any)
      .force(
        'link',
        d3
          .forceLink(links)
          .id((d: any) => d.id)
          .distance((d: any) => {
            // Optimized distances for better layout
            if (d.source.type === 'step' && d.target.type === 'step') return 150;
            if (d.target.type === 'final') return 180;
            return 120;
          })
          .strength(0.8)
      )
      .force('charge', d3.forceManyBody().strength((d: any) => {
        // Enhanced repulsion for cleaner spacing
        if (d.type === 'final') return -1200;
        if (d.type === 'step') return -800;
        return -600;
      }))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius((d: any) => {
        const baseRadius = getNodeRadius(d.type);
        return baseRadius + 25;
      }))
      // Improved positioning forces for better alignment
      .force('x', d3.forceX((d: any) => {
        if (d.type === 'step') return width / 2;
        if (d.type === 'benefit') return width * 0.15;
        if (d.type === 'consequence') return width * 0.85;
        if (d.type === 'alternative') return width / 2;
        return width / 2;
      }).strength(0.15))
      .force('y', d3.forceY((d: any) => {
        if (d.type === 'step') return height * 0.25;
        if (d.type === 'benefit') return height * 0.65;
        if (d.type === 'consequence') return height * 0.65;
        if (d.type === 'alternative') return height * 0.85;
        if (d.type === 'final') return height * 0.5;
        return height / 2;
      }).strength(0.25))
      .stop();

    // Run simulation with more iterations for perfect positioning
    for (let i = 0; i < 800; i++) simulation.tick();

    // Enhanced gradient definitions with more beautiful colors
    const defs = container.append('defs');

    // Create enhanced gradients for nodes
    const gradients = [
      { id: 'stepGradient', colors: ['#8b5cf6', '#6366f1'], shadow: '#4c1d95' },
      { id: 'benefitGradient', colors: ['#10b981', '#06d6a0'], shadow: '#047857' },
      { id: 'consequenceGradient', colors: ['#ef4444', '#f87171'], shadow: '#b91c1c' },
      { id: 'alternativeGradient', colors: ['#f59e0b', '#fbbf24'], shadow: '#d97706' },
      { id: 'finalGradient', colors: ['#06b6d4', '#0ea5e9', '#3b82f6'], shadow: '#0c4a6e' }
    ];

    gradients.forEach(grad => {
      const gradient = defs.append('radialGradient')
        .attr('id', grad.id)
        .attr('cx', '25%')
        .attr('cy', '25%');

      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', grad.colors[0])
        .attr('stop-opacity', '1');

      gradient.append('stop')
        .attr('offset', '70%')
        .attr('stop-color', grad.colors[1])
        .attr('stop-opacity', '0.9');

      if (grad.colors[2]) {
        gradient.append('stop')
          .attr('offset', '100%')
          .attr('stop-color', grad.colors[2])
          .attr('stop-opacity', '0.8');
      }
    });

    // Enhanced shadow filter with glow effect
    const filter = defs.append('filter')
      .attr('id', 'glow-shadow')
      .attr('x', '-100%')
      .attr('y', '-100%')
      .attr('width', '300%')
      .attr('height', '300%');

    // Outer glow
    filter.append('feGaussianBlur')
      .attr('stdDeviation', '4')
      .attr('result', 'coloredBlur');

    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Drop shadow
    filter.append('feDropShadow')
      .attr('dx', 3)
      .attr('dy', 3)
      .attr('stdDeviation', 2)
      .attr('flood-opacity', 0.4);

    // Enhanced links with beautiful gradients and animations
    const linkGroup = container.append('g').attr('class', 'links');

    const linkGradient = defs.append('linearGradient')
      .attr('id', 'linkGradient')
      .attr('gradientUnits', 'userSpaceOnUse');

    linkGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#8b5cf6')
      .attr('stop-opacity', '0.8');

    linkGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#06b6d4')
      .attr('stop-opacity', '0.6');

    linkGroup
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', (d: any) => {
        if (d.source.type === 'step' && d.target.type === 'step') return 'url(#linkGradient)';
        if (d.target.type === 'final') return '#06b6d4';
        if (d.source.type === 'benefit') return '#10b981';
        if (d.source.type === 'consequence') return '#ef4444';
        if (d.source.type === 'alternative') return '#f59e0b';
        return '#6b7280';
      })
      .attr('stroke-opacity', 0.7)
      .attr('stroke-width', (d: any) => {
        if (d.target.type === 'final') return 3;
        if (d.source.type === 'step' && d.target.type === 'step') return 2.5;
        return 2;
      })
      .attr('stroke-linecap', 'round')
      .attr('x1', (d: any) => d.source.x || 0)
      .attr('y1', (d: any) => d.source.y || 0)
      .attr('x2', (d: any) => d.target.x || 0)
      .attr('y2', (d: any) => d.target.y || 0);

    // Enhanced nodes with beautiful styling
    const nodeGroup = container
      .append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr('transform', (d: any) => `translate(${d.x || 0},${d.y || 0})`)
      .style('cursor', 'grab');

    // Add circles with enhanced styling
    nodeGroup
      .append('circle')
      .attr('r', (d) => getNodeRadius(d.type))
      .attr('fill', (d) => {
        switch (d.type) {
          case 'step': return 'url(#stepGradient)';
          case 'benefit': return 'url(#benefitGradient)';
          case 'consequence': return 'url(#consequenceGradient)';
          case 'alternative': return 'url(#alternativeGradient)';
          case 'final': return 'url(#finalGradient)';
          default: return '#6b7280';
        }
      })
      .attr('stroke', (d) => {
        switch (d.type) {
          case 'step': return '#4c1d95';
          case 'benefit': return '#047857';
          case 'consequence': return '#b91c1c';
          case 'alternative': return '#d97706';
          case 'final': return '#0c4a6e';
          default: return '#1f2937';
        }
      })
      .attr('stroke-width', 2)
      .attr('filter', 'url(#glow-shadow)')
      .style('transition', 'all 0.3s ease');

    // Add text labels with better formatting
    nodeGroup
      .append('text')
      .text((d) => {
        const label = d.label || 'No label';
        return label.length > 30 ? label.slice(0, 27) + '...' : label;
      })
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .attr('fill', 'white')
      .style('pointer-events', 'none')
      .style('font-size', (d) => d.type === 'final' ? '14px' : '11px')
      .style('font-family', 'system-ui, -apple-system, sans-serif')
      .style('font-weight', '600')
      .style('text-shadow', '1px 1px 2px rgba(0,0,0,0.8)');

    // Enhanced tooltip
    const tooltip = d3
      .select('body')
      .append('div')
      .style('position', 'absolute')
      .style('padding', '12px')
      .style('background', 'linear-gradient(135deg, rgba(0,0,0,0.9), rgba(30,30,30,0.9))')
      .style('color', 'white')
      .style('border-radius', '8px')
      .style('font-size', '13px')
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .style('z-index', '1000')
      .style('box-shadow', '0 4px 12px rgba(0,0,0,0.3)')
      .style('border', '1px solid rgba(255,255,255,0.1)')
      .style('backdrop-filter', 'blur(10px)')
      .style('max-width', '300px');

    // Enhanced interactions
    nodeGroup
      .on('mouseenter', function (event, d: Node) {
        // Highlight connected nodes
        d3.select(this).select('circle')
          .transition()
          .duration(200)
          .attr('r', getNodeRadius(d.type) * 1.2)
          .attr('stroke-width', 3);

        tooltip
          .html(`
            <div style="font-weight: bold; color: #a78bfa; margin-bottom: 4px;">
              ${(d.type || 'unknown').toUpperCase()}
            </div>
            <div style="line-height: 1.4;">
              ${d.label || 'No label'}
            </div>
          `)
          .style('left', event.pageX + 15 + 'px')
          .style('top', event.pageY - 10 + 'px')
          .transition()
          .duration(200)
          .style('opacity', 1);
      })
      .on('mouseleave', function (d: any) {
        d3.select(this).select('circle')
          .transition()
          .duration(200)
          .attr('r', getNodeRadius(d.type))
          .attr('stroke-width', 2);

        tooltip
          .transition()
          .duration(200)
          .style('opacity', 0);
      });

    // Add zoom controls
    const controlsGroup = svg.append('g')
      .attr('class', 'zoom-controls')
      .attr('transform', `translate(${width - 80}, 20)`);

    // Zoom in button
    const zoomInButton = controlsGroup.append('g')
      .style('cursor', 'pointer')
      .on('click', () => {
        svg.transition().duration(300).call(
          zoom.scaleBy as any, 1.5
        );
      });

    zoomInButton.append('circle')
      .attr('r', 20)
      .attr('fill', 'rgba(0,0,0,0.7)')
      .attr('stroke', '#8b5cf6')
      .attr('stroke-width', 2);

    zoomInButton.append('text')
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .text('+');

    // Zoom out button
    const zoomOutButton = controlsGroup.append('g')
      .attr('transform', 'translate(0, 50)')
      .style('cursor', 'pointer')
      .on('click', () => {
        svg.transition().duration(300).call(
          zoom.scaleBy as any, 1 / 1.5
        );
      });

    zoomOutButton.append('circle')
      .attr('r', 20)
      .attr('fill', 'rgba(0,0,0,0.7)')
      .attr('stroke', '#8b5cf6')
      .attr('stroke-width', 2);

    zoomOutButton.append('text')
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .text('−');

    // Reset zoom button
    const resetButton = controlsGroup.append('g')
      .attr('transform', 'translate(0, 100)')
      .style('cursor', 'pointer')
      .on('click', () => {
        svg.transition().duration(500).call(
          zoom.transform as any,
          d3.zoomIdentity
        );
      });

    resetButton.append('circle')
      .attr('r', 20)
      .attr('fill', 'rgba(0,0,0,0.7)')
      .attr('stroke', '#8b5cf6')
      .attr('stroke-width', 2);

    resetButton.append('text')
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .text('⌂');

    // Cleanup function
    return () => {
      tooltip.remove();
    };
  }, [result]);

  return (
    <>
      <div className="flex justify-center mb-4 relative">
        <svg
          ref={svgRef}
          width={width}
          height={height}
          style={{
            border: '2px solid #374151',
            borderRadius: 12,
            backgroundColor: '#0f0f0f',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
          }}
        />
        <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-gray-300 border border-gray-600">
          🔍 Drag to pan • Scroll/pinch to zoom • Hover nodes for details
        </div>
      </div>
      <div style={{ maxWidth: width, margin: '10px auto', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <h3 className="text-purple-300 font-semibold mb-3 text-lg">Final Thought:</h3>
        <p className="text-purple-100/80 text-sm leading-relaxed bg-black/20 rounded-lg p-4 border border-purple-400/20">
          {result.final_thought}
        </p>
      </div>
    </>
  );
}

export default function CoTGraph({ result }: { result?: Result }) {
  console.log('CoTGraph received result:', result);

  if (!result) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-lg font-medium text-purple-300 mb-2">
            Loading Chain of Thought visualization...
          </div>
          <div className="text-sm text-purple-100/60">
            Please wait while we prepare your results
          </div>
        </div>
      </div>
    );
  }

  // More robust validation - check if any required property exists
  const hasSteps = Array.isArray(result.steps);
  const hasBenefits = Array.isArray(result.benefits);
  const hasConsequences = Array.isArray(result.consequences);
  const hasAlternativePaths = Array.isArray(result.alternative_paths);
  const hasFinalThought = result.final_thought;

  console.log('Validation results:', {
    hasSteps,
    hasBenefits,
    hasConsequences,
    hasAlternativePaths,
    hasFinalThought,
    stepsLength: hasSteps ? result.steps.length : 'N/A',
    benefitsLength: hasBenefits ? result.benefits.length : 'N/A',
    consequencesLength: hasConsequences ? result.consequences.length : 'N/A',
    alternativePathsLength: hasAlternativePaths ? result.alternative_paths.length : 'N/A'
  });

  // Only require final_thought as minimum
  if (!hasFinalThought) {
    console.error('Missing required final_thought:', result);
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-lg font-medium text-red-400 mb-2">
            Invalid result data
          </div>
          <div className="text-sm text-purple-100/60 mb-4">
            Missing final thought in the analysis
          </div>
          <div className="text-xs text-gray-400">
            Check console for details
          </div>
        </div>
      </div>
    );
  }

  return <CoTGraphVisualization result={result} />;
}