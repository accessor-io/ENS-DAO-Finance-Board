import React, { useEffect, useMemo, useRef, useState } from 'react';
import { walletDirectory } from '../data/walletDirectory';

// Connected, animated schema of cards laid out radially by category.
// No external deps; pure SVG + CSS transitions.

const CATEGORY_META = {
  'dao-treasury': { label: 'Treasury', angleDeg: -90 },
  'dao-wallet': { label: 'DAO Wallets', angleDeg: -45 },
  'multisig': { label: 'Multisigs', angleDeg: 0 },
  'working-group': { label: 'Working Groups', angleDeg: 180 },
  'endaoment': { label: 'Endaoment', angleDeg: 90 },
  'controller': { label: 'Controllers', angleDeg: 135 },
  'contract': { label: 'Contracts', angleDeg: -135 },
};

function degToRad(deg) {
  return (deg * Math.PI) / 180;
}

function polarToCartesian(cx, cy, r, angleDeg) {
  const a = degToRad(angleDeg);
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

export default function SchemaGraph({ onNavigate = () => {} }) {
  const containerRef = useRef(null);
  const graphRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [expanded, setExpanded] = useState(false);
  const [highlightCat, setHighlightCat] = useState(null);
  const [view, setView] = useState({ zoom: 1, panX: 0, panY: 0 });
  const panState = useRef({ dragging: false, startX: 0, startY: 0, startPanX: 0, startPanY: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => setSize({ width: el.clientWidth, height: Math.max(el.clientHeight, 560) });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    const t = setTimeout(() => setExpanded(true), 150);
    return () => {
      ro.disconnect();
      clearTimeout(t);
    };
  }, []);

  const center = useMemo(() => ({ x: size.width / 2, y: size.height / 2 }), [size]);
  const radius = useMemo(() => Math.max(160, Math.min(size.width, size.height) * 0.28), [size]);

  const data = useMemo(() => {
    // Group wallets by category; default to 'dao-wallet' if missing
    const groups = new Map();
    for (const w of walletDirectory) {
      const cat = w.category || 'dao-wallet';
      if (!groups.has(cat)) groups.set(cat, []);
      groups.get(cat).push(w);
    }
    // Build category nodes
    const categories = Array.from(groups.entries()).map(([key, items]) => ({
      key,
      label: CATEGORY_META[key]?.label || key,
      angleDeg: CATEGORY_META[key]?.angleDeg ?? 0,
      items,
    }));
    // Stable sort by angle for consistent layout
    categories.sort((a, b) => a.angleDeg - b.angleDeg);
    return categories;
  }, []);

  const positions = useMemo(() => {
    const catRadius = radius;
    const nodeBaseRadius = Math.max(90, radius * 0.6);
    const layout = { cats: {}, nodes: {} };
    data.forEach((cat) => {
      // Category node at fixed radius
      const cp = polarToCartesian(center.x, center.y, catRadius, cat.angleDeg);
      layout.cats[cat.key] = cp;
      // Spread item nodes in a small arc around the category angle
      const items = cat.items || [];
      const arc = Math.min(70, 12 + items.length * 6); // degrees span
      const start = cat.angleDeg - arc / 2;
      const step = items.length > 1 ? arc / (items.length - 1) : 0;
      items.forEach((w, idx) => {
        const angle = start + idx * step;
        const r = nodeBaseRadius + (idx % 5) * 28; // ripple outwards
        const p = polarToCartesian(center.x, center.y, r, angle);
        layout.nodes[w.address.toLowerCase()] = { x: p.x, y: p.y, angle, r };
      });
    });
    return layout;
  }, [data, center, radius]);

  const allNodes = useMemo(() => walletDirectory.map((w) => ({ ...w, key: w.address.toLowerCase() })), []);

  return (
    <div className="glass-elevated rounded border border-gray-700 p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-white text-lg font-semibold">ENS DAO Schema Map</h3>
          <p className="text-gray-400 text-sm">Animated, connected cards by category</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="btn btn-secondary"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? 'Collapse' : 'Expand'}
          </button>
          <div className="hidden md:flex items-center gap-1">
            <button className="btn btn-secondary" onClick={() => setView(v => ({ ...v, zoom: Math.min(2, +(v.zoom + 0.1).toFixed(2)) }))}>+
            </button>
            <button className="btn btn-secondary" onClick={() => setView(v => ({ ...v, zoom: Math.max(0.5, +(v.zoom - 0.1).toFixed(2)) }))}>-
            </button>
            <button className="btn btn-secondary" onClick={() => setView({ zoom: 1, panX: 0, panY: 0 })}>Reset</button>
          </div>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative w-full"
        style={{ minHeight: 560 }}
        onMouseDown={(e) => {
          const ps = panState.current;
          ps.dragging = true;
          ps.startX = e.clientX;
          ps.startY = e.clientY;
          ps.startPanX = view.panX;
          ps.startPanY = view.panY;
        }}
        onMouseMove={(e) => {
          const ps = panState.current;
          if (!ps.dragging) return;
          const dx = e.clientX - ps.startX;
          const dy = e.clientY - ps.startY;
          setView(v => ({ ...v, panX: ps.startPanX + dx, panY: ps.startPanY + dy }));
        }}
        onMouseUp={() => (panState.current.dragging = false)}
        onMouseLeave={() => (panState.current.dragging = false)}
        onWheel={(e) => {
          e.preventDefault();
          const delta = -Math.sign(e.deltaY) * 0.1;
          setView(v => ({ ...v, zoom: Math.max(0.5, Math.min(2, +(v.zoom + delta).toFixed(2))) }));
        }}
      >
        <div
          ref={graphRef}
          className="absolute inset-0"
          style={{ transform: `translate(${view.panX}px, ${view.panY}px) scale(${view.zoom})`, transformOrigin: '50% 50%' }}
        >
        {/* Connectors */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          {/* Center to categories */}
          {data.map((cat, i) => {
            const cp = positions.cats[cat.key] || center;
            const key = `c-${cat.key}`;
            return (
              <line
                key={key}
                x1={center.x}
                y1={center.y}
                x2={expanded ? cp.x : center.x}
                y2={expanded ? cp.y : center.y}
                stroke="url(#lineGrad)"
                strokeWidth={1.5}
                className="transition-all duration-700"
                style={{ transitionDelay: `${i * 40}ms` }}
              />
            );
          })}
          {/* Categories to nodes */}
          {allNodes.map((n, i) => {
            const catKey = n.category || 'dao-wallet';
            const cp = positions.cats[catKey] || center;
            const np = positions.nodes[n.address.toLowerCase()] || center;
            const k = `n-${n.address}`;
            return (
              <line
                key={k}
                x1={expanded ? cp.x : center.x}
                y1={expanded ? cp.y : center.y}
                x2={expanded ? np.x : center.x}
                y2={expanded ? np.y : center.y}
                stroke="rgba(148,163,184,0.35)"
                strokeWidth={1}
                className="transition-all duration-700"
                style={{ transitionDelay: `${150 + (i % 20) * 25}ms` }}
              />
            );
          })}
        </svg>

        {/* Center hub */}
        <Card
          x={center.x}
          y={center.y}
          title="ENS DAO"
          subtitle="Hub"
          highlight
          style={{ transform: 'translate(-50%, -50%)' }}
        />

        {/* Category cards */}
        {data.map((cat, i) => {
          const p = positions.cats[cat.key] || center;
          const x = expanded ? p.x : center.x;
          const y = expanded ? p.y : center.y;
          const active = !highlightCat || highlightCat === cat.key;
          return (
            <Card
              key={cat.key}
              x={x}
              y={y}
              title={cat.label}
              subtitle={`${cat.items?.length || 0} nodes`}
              dim={!active}
              onHover={(hov) => setHighlightCat(hov ? cat.key : null)}
              interactive
              onClick={() => setHighlightCat(prev => (prev === cat.key ? null : cat.key))}
              delayMs={i * 40}
            />
          );
        })}

        {/* Wallet nodes */}
        {allNodes.map((n, idx) => {
          const np = positions.nodes[n.address.toLowerCase()] || center;
          const x = expanded ? np.x : center.x;
          const y = expanded ? np.y : center.y;
          const catKey = n.category || 'dao-wallet';
          const visible = !highlightCat || highlightCat === catKey;
          return (
            <Card
              key={n.address}
              x={x}
              y={y}
              title={n.label || n.ensName || 'Wallet'}
              subtitle={`${n.address.slice(0, 6)}…${n.address.slice(-4)}`}
              small
              dim={!visible}
              interactive
              onClick={(ev) => {
                const target = ev.altKey ? 'wallets' : 'transactions';
                onNavigate(target, { wallet: n.address });
              }}
              onHover={(hov) => {
                if (!hov) return;
                // Smooth pan focus to hovered node
                const focusX = (size.width / 2) - (x - size.width / 2);
                const focusY = (size.height / 2) - (y - size.height / 2);
                setView(v => ({ ...v, panX: focusX, panY: focusY }));
              }}
              delayMs={150 + (idx % 20) * 25}
            />
          );
        })}
        </div>
      </div>
    </div>
  );
}

function Card({ x, y, title, subtitle, small = false, highlight = false, dim = false, onHover, onClick, interactive = false, delayMs = 0, style }) {
  const base = small ? 'p-2 min-w-[140px]' : 'p-3 min-w-[170px]';
  const scale = highlight ? 'scale-105' : 'scale-100';
  return (
    <div
      className={`absolute glass rounded border border-gray-700 text-white shadow-md transition-all duration-700 ${base} ${scale} ${dim ? 'opacity-60' : 'opacity-100'} ${interactive ? 'hover:shadow-lg hover:-translate-y-0.5 cursor-pointer focus-ring' : ''}`}
      style={{ left: x, top: y, transform: `translate(-50%, -50%)`, transitionDelay: `${delayMs}ms`, ...style }}
      tabIndex={interactive ? 0 : -1}
      onClick={onClick}
      onKeyDown={(e) => {
        if (!interactive) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick && onClick(e);
        }
      }}
      onMouseEnter={() => onHover && onHover(true)}
      onMouseLeave={() => onHover && onHover(false)}
    >
      <div className="text-sm font-semibold truncate">{title}</div>
      {subtitle && <div className="text-xs text-gray-300 truncate mt-0.5">{subtitle}</div>}
    </div>
  );
}


