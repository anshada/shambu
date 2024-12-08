import * as React from 'react';
import * as d3 from 'd3';
import { Profile, Connection } from '@shambu/shared/types';

interface NetworkGraphProps {
  profiles: Profile[];
  connections: Connection[];
  onNodeClick?: (profile: Profile) => void;
}

interface Node extends d3.SimulationNodeDatum {
  id: string;
  fullName: string;
  avatarUrl?: string;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  type: string;
  strength: number;
}

export function NetworkGraph({ profiles, connections, onNodeClick }: NetworkGraphProps) {
  const svgRef = React.useRef<SVGSVGElement>(null);

  React.useEffect(() => {
    if (!svgRef.current || !profiles.length) return;

    const width = 800;
    const height = 600;

    // Clear previous graph
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // Create nodes and links
    const nodes: Node[] = profiles.map(p => ({
      id: p.id,
      fullName: p.fullName,
      avatarUrl: p.avatarUrl,
    }));

    const links: Link[] = connections.map(c => ({
      source: c.sourceId,
      target: c.targetId,
      type: c.type,
      strength: c.strength,
    }));

    // Create simulation
    const simulation = d3
      .forceSimulation<Node>(nodes)
      .force(
        'link',
        d3
          .forceLink<Node, Link>(links)
          .id(d => d.id)
          .distance(100)
      )
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(0, 0));

    // Draw links
    const link = svg
      .append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', d => Math.sqrt(d.strength || 1) * 2);

    // Draw nodes
    const node = svg
      .append('g')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', 20)
      .attr('fill', '#69b3a2')
      .call(d3.drag<SVGCircleElement, Node>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any
      );

    // Add labels
    const labels = svg
      .append('g')
      .selectAll('text')
      .data(nodes)
      .join('text')
      .text(d => d.fullName)
      .attr('font-size', '12px')
      .attr('dx', 25)
      .attr('dy', 5);

    // Add click handler
    if (onNodeClick) {
      node.on('click', (_event: MouseEvent, d: Node) => {
        const profile = profiles.find(p => p.id === d.id);
        if (profile) onNodeClick(profile);
      });
    }

    // Update positions
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as Node).x || 0)
        .attr('y1', d => (d.source as Node).y || 0)
        .attr('x2', d => (d.target as Node).x || 0)
        .attr('y2', d => (d.target as Node).y || 0);

      node
        .attr('cx', d => d.x || 0)
        .attr('cy', d => d.y || 0);

      labels
        .attr('x', d => d.x || 0)
        .attr('y', d => d.y || 0);
    });

    // Drag functions
    function dragstarted(event: d3.D3DragEvent<SVGCircleElement, Node, Node>) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: d3.D3DragEvent<SVGCircleElement, Node, Node>) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGCircleElement, Node, Node>) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [profiles, connections, onNodeClick]);

  return <svg ref={svgRef} className="w-full h-full" />;
} 