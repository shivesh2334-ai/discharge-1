// components/DataSourceCards.tsx

interface CardProps {
  title: string;
  icon: string;
  lines: number;
  preview: string;
  color: string;
}

function DataCard({ title, icon, lines, preview, color }: CardProps) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        padding: 16,
        border: `1.5px solid ${color}22`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 4,
          height: '100%',
          background: color,
          borderRadius: '12px 0 0 12px',
        }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{title}</span>
      </div>
      <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 6 }}>{lines} entries from EMR</div>
      <div
        style={{
          fontSize: 11,
          color: '#64748b',
          fontStyle: 'italic',
          lineHeight: 1.4,
          background: '#f8fafc',
          borderRadius: 6,
          padding: '6px 8px',
        }}
      >
        {preview.length > 60 ? preview.slice(0, 60) + '…' : preview}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
        <span style={{ fontSize: 11, color: '#22c55e', fontWeight: 600 }}>Loaded</span>
      </div>
    </div>
  );
}

interface Props {
  clinicalNotes: string;
  labs: string;
  diagnostics: string;
}

export default function DataSourceCards({ clinicalNotes, labs, diagnostics }: Props) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
      <DataCard
        title="Clinical Notes"
        icon="📝"
        lines={clinicalNotes.split('\n').length}
        preview={clinicalNotes.split('\n')[0]}
        color="#0891b2"
      />
      <DataCard
        title="Lab Reports"
        icon="🧪"
        lines={labs.split('\n').length}
        preview="CBC, Biochemistry, Lipids, HbA1c…"
        color="#7c3aed"
      />
      <DataCard
        title="Diagnostics"
        icon="📊"
        lines={diagnostics.split('\n').length}
        preview="ECG, Echo, Angio, CXR…"
        color="#d97706"
      />
    </div>
  );
}
