interface FlowNode {
  id: string;
  label: string;
  description: string;
}

export function CapabilityFlowDiagram({ nodes }: { nodes: FlowNode[] }) {
  return (
    <div className="mt-10 overflow-x-auto pb-2">
      <div className="flex min-w-[min(100%,640px)] flex-col gap-3 sm:min-w-0 sm:flex-row sm:items-stretch sm:justify-between">
        {nodes.map((node, i) => (
          <div key={node.id} className="flex flex-1 items-center gap-2 sm:flex-col sm:gap-0">
            <div className="flex-1 rounded-xl border border-brand-200 bg-brand-50/50 p-4 text-center sm:w-full">
              <p className="text-sm font-bold text-brand-800">{node.label}</p>
              <p className="mt-1 text-xs text-surface-600">{node.description}</p>
            </div>
            {i < nodes.length - 1 && (
              <span className="hidden shrink-0 text-brand-400 sm:block" aria-hidden="true">
                →
              </span>
            )}
            {i < nodes.length - 1 && (
              <span className="text-brand-400 sm:hidden" aria-hidden="true">
                ↓
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
