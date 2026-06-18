// components/PipelineSteps.tsx

interface Step {
  label: string;
  icon: string;
}

const STEPS: Step[] = [
  { label: 'Analyse Content', icon: '🔬' },
  { label: 'Generate Summary', icon: '📋' },
  { label: 'Refine & Finalise', icon: '✅' },
];

interface Props {
  currentStep: number; // 0 = idle, 1/2/3 = active step, 4 = complete
  complete: boolean;
}

export default function PipelineSteps({ currentStep, complete }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        background: '#fff',
        borderRadius: 14,
        padding: '14px 20px',
        border: '1px solid #e2e8f0',
        marginBottom: 24,
      }}
    >
      {STEPS.map((s, i) => {
        const done = complete || currentStep > i + 1;
        const active = currentStep === i + 1;
        return (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: done ? '#1a1f3a' : active ? '#e85d5d' : '#f1f5f9',
                  fontSize: done ? 16 : 18,
                  border: `2px solid ${done ? '#1a1f3a' : active ? '#e85d5d' : '#e2e8f0'}`,
                  color: done || active ? '#fff' : undefined,
                  transition: 'all 0.4s',
                }}
              >
                {done ? '✓' : s.icon}
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#475569',
                  marginTop: 6,
                  textAlign: 'center',
                }}
              >
                {s.label}
              </div>
            </div>
            {i < 2 && (
              <div
                style={{
                  width: 40,
                  height: 2,
                  flexShrink: 0,
                  background: done ? '#1a1f3a' : '#e2e8f0',
                  transition: 'all 0.4s',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
