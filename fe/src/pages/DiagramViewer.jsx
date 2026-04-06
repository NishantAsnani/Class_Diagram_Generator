import { useCallback, useEffect, useMemo, useState } from "react";
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    addEdge,
    Panel,
    BackgroundVariant,
    Handle,    // Required for connections
    Position,  // Required for connection placement
} from "reactflow";
import "reactflow/dist/style.css";

// ─── Custom Class Node ────────────────────────────────────────────────────────
function ClassNode({ data }) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div
            style={{
                minWidth: 200,
                maxWidth: 260,
                background: "rgba(15,15,25,0.95)",
                border: `1.5px solid ${data.color || "#6366f1"}40`,
                borderRadius: 12,
                boxShadow: `0 0 24px ${data.color || "#6366f1"}18, 0 4px 24px rgba(0,0,0,0.5)`,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                fontSize: 11,
                position: "relative",
                // Critical: must be visible so handles aren't hidden
                overflow: "visible", 
            }}
        >
            {/* Target Handle: Where lines point TO */}
            <Handle
                type="target"
                position={Position.Top}
                style={{ background: data.color, width: 8, height: 8, border: '2px solid #0a0a0f' }}
            />

            <div
                style={{
                    background: `linear-gradient(135deg, ${data.color || "#6366f1"}30, ${data.color || "#6366f1"}10)`,
                    borderBottom: `1px solid ${data.color || "#6366f1"}30`,
                    padding: "10px 14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    userSelect: "none",
                    borderRadius: "12px 12px 0 0"
                }}
                onClick={() => setCollapsed((c) => !c)}
            >
                <div>
                    <div style={{ color: "#ffffff60", fontSize: 9, letterSpacing: "0.12em", marginBottom: 2, textTransform: "uppercase" }}>
                        {data.nodeType || "class"}
                    </div>
                    <div style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>
                        {data.label}
                    </div>
                </div>
                <span style={{ color: data.color || "#6366f1", fontSize: 10, opacity: 0.7 }}>
                    {collapsed ? "▶" : "▼"}
                </span>
            </div>

            {!collapsed && (
                <div style={{ overflow: "hidden" }}>
                    <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "8px 14px", minHeight: 36 }}>
                        <div style={{ color: "#ffffff25", fontSize: 9, letterSpacing: "0.1em", marginBottom: 6, textTransform: "uppercase" }}>Attributes</div>
                        {data.attributes?.length > 0 ? (
                            data.attributes.map((attr, i) => (
                                <div key={i} style={{ color: "#a5b4fc", padding: "2px 0", display: "flex", gap: 6 }}>
                                    <span style={{ color: "#6366f160" }}>+</span>
                                    <span style={{ wordBreak: "break-word" }}>{attr}</span>
                                </div>
                            ))
                        ) : (
                            <div style={{ color: "#ffffff20", fontStyle: "italic" }}>— none —</div>
                        )}
                    </div>
                    <div style={{ padding: "8px 14px", minHeight: 36 }}>
                        <div style={{ color: "#ffffff25", fontSize: 9, letterSpacing: "0.1em", marginBottom: 6, textTransform: "uppercase" }}>Methods</div>
                        {data.methods?.length > 0 ? (
                            data.methods.map((method, i) => (
                                <div key={i} style={{ color: "#86efac", padding: "2px 0", display: "flex", gap: 6 }}>
                                    <span style={{ color: "#22c55e60" }}>#</span>
                                    <span style={{ wordBreak: "break-word" }}>{method}</span>
                                </div>
                            ))
                        ) : (
                            <div style={{ color: "#ffffff20", fontStyle: "italic" }}>— none —</div>
                        )}
                    </div>
                </div>
            )}

            {/* Source Handle: Where lines come FROM */}
            <Handle
                type="source"
                position={Position.Bottom}
                style={{ background: data.color, width: 8, height: 8, border: '2px solid #0a0a0f' }}
            />
        </div>
    );
}

const nodeTypes = { classNode: ClassNode };

const NODE_COLORS = [
    "#6366f1", "#8b5cf6", "#ec4899", "#06b6d4",
    "#10b981", "#f59e0b", "#ef4444", "#3b82f6",
];

const TYPE_MAP = {
    inheritance: { label: "extends", color: "#8b5cf6", dash: false, animated: false },
    implements: { label: "implements", color: "#06b6d4", dash: true, animated: true },
    association: { label: "uses", color: "#6366f1", dash: true, animated: false },
    dependency: { label: "depends", color: "#f59e0b", dash: true, animated: false },
};

function buildLayout(classes) {
    const COLS = Math.ceil(Math.sqrt(classes.length)) || 1;
    return classes.map((cls, i) => ({
        id: cls.name,
        type: "classNode",
        position: {
            x: (i % COLS) * 350 + 50,
            y: Math.floor(i / COLS) * 400 + 50,
        },
        data: {
            label: cls.name,
            attributes: cls.attributes || [],
            methods: cls.methods || [],
            nodeType: cls.type || "class",
            color: NODE_COLORS[i % NODE_COLORS.length],
        },
    }));
}

function buildEdges(relations, classes) {
    if (!relations?.length || !classes?.length) return [];
    const classNames = new Set(classes.map((c) => c.name));

    return relations
        .filter((rel) => rel.from && rel.to && classNames.has(rel.from) && classNames.has(rel.to))
        .map((rel, i) => {
            const s = TYPE_MAP[rel.type] || { label: rel.type || "", color: "#6366f1", dash: false, animated: false };
            return {
                id: `edge-${rel.from}-${rel.to}-${i}`,
                source: rel.from,
                target: rel.to,
                label: s.label,
                type: "smoothstep",
                animated: s.animated,
                style: {
                    stroke: s.color,
                    strokeWidth: 2,
                    strokeDasharray: s.dash ? "5,4" : undefined,
                },
                labelStyle: { fill: "#ffffff60", fontSize: 10, fontFamily: "monospace" },
                labelBgStyle: { fill: "#0a0a0f", fillOpacity: 0.85 },
                labelBgPadding: [4, 6],
                markerEnd: {
                    type: "arrowclosed",
                    color: s.color,
                },
            };
        });
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function DiagramViewer({ data }) {
    const initialNodes = useMemo(() => buildLayout(data.classes || []), [data]);
    const initialEdges = useMemo(() => buildEdges(data.relations, data.classes), [data]);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const onConnect = useCallback((p) => setEdges((e) => addEdge(p, e)), [setEdges]);
    const [selected, setSelected] = useState(null);

    // Sync nodes and edges when data changes
    useEffect(() => {
        setNodes(initialNodes);
        // Small delay ensures nodes are mounted so edges can find handles
        const timer = setTimeout(() => setEdges(initialEdges), 50);
        return () => clearTimeout(timer);
    }, [initialNodes, initialEdges, setNodes, setEdges]);

    if (!data?.classes?.length) return null;

    const stats = {
        classes: data.classes.length,
        attributes: data.classes.reduce((s, c) => s + (c.attributes?.length || 0), 0),
        methods: data.classes.reduce((s, c) => s + (c.methods?.length || 0), 0),
        relations: (data.relations || []).length,
    };

    return (
        <div style={{ background: "rgba(10,10,15,0.8)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>
            {/* Stats bar */}
            <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "12px 20px", background: "rgba(0,0,0,0.3)" }}>
                {[
                    { label: "Classes", value: stats.classes, color: "#6366f1" },
                    { label: "Attributes", value: stats.attributes, color: "#a5b4fc" },
                    { label: "Methods", value: stats.methods, color: "#86efac" },
                    { label: "Relations", value: stats.relations, color: "#c4b5fd" },
                ].map((s) => (
                    <div key={s.label} style={{ flex: 1, textAlign: "center", borderRight: "1px solid rgba(255,255,255,0.05)", padding: "2px 0" }}>
                        <div style={{ color: s.color, fontFamily: "monospace", fontSize: 20, fontWeight: 700 }}>{s.value}</div>
                        <div style={{ color: "#ffffff30", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase" }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* ReactFlow canvas */}
            <div style={{ height: 700 }}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    onNodeClick={(_, node) => setSelected(node.data)}
                    fitView
                    fitViewOptions={{ padding: 0.2 }}
                    minZoom={0.1}
                    maxZoom={1.5}
                >
                    <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="rgba(99,102,241,0.12)" />
                    <Controls />
                    <MiniMap
                        style={{ background: "rgba(10,10,15,0.9)" }}
                        nodeColor={(n) => n.data?.color || "#6366f1"}
                    />
                    <Panel position="top-left">
                        <div style={{ background: "rgba(10,10,15,0.9)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "10px 14px", fontFamily: "monospace", fontSize: 11, color: "#ffffff50" }}>
                            <div style={{ marginBottom: 8, color: "#ffffff30", fontSize: 9, textTransform: "uppercase" }}>Legend</div>
                            {Object.values(TYPE_MAP).map((t) => (
                                <div key={t.label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                    <svg width="24" height="10">
                                        <line x1="0" y1="5" x2="24" y2="5" stroke={t.color} strokeWidth="2" strokeDasharray={t.dash ? "4,3" : undefined} />
                                    </svg>
                                    <span>{t.label}</span>
                                </div>
                            ))}
                        </div>
                    </Panel>
                </ReactFlow>
            </div>

            {/* Selected detail panel */}
            {selected && (
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "16px 24px", background: "rgba(0,0,0,0.4)", display: "flex", gap: 40, alignItems: "flex-start", fontFamily: "monospace", fontSize: 12 }}>
                    <div>
                        <div style={{ color: "#ffffff30", fontSize: 9, textTransform: "uppercase", marginBottom: 4 }}>Selected</div>
                        <div style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>{selected.label}</div>
                    </div>
                    <div>
                        <div style={{ color: "#ffffff30", fontSize: 9, textTransform: "uppercase", marginBottom: 4 }}>Attributes</div>
                        <div style={{ color: "#a5b4fc" }}>{selected.attributes.length || 0} items</div>
                    </div>
                    <div>
                        <div style={{ color: "#ffffff30", fontSize: 9, textTransform: "uppercase", marginBottom: 4 }}>Methods</div>
                        <div style={{ color: "#86efac" }}>{selected.methods.length || 0} items</div>
                    </div>
                    <button onClick={() => setSelected(null)} style={{ marginLeft: "auto", color: "#ffffff30", background: "none", border: "none", cursor: "pointer" }}>✕ Close</button>
                </div>
            )}
        </div>
    );
}