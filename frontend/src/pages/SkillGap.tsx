import { Badge } from '@/components/ui/badge';
import { MockBanner } from '@/components/MockBanner';
import { useLearnMate } from '@/context/LearnMateContext';
import type { SkillPriority } from '@/types/index';

const priorityConfig: Record<
  SkillPriority,
  { label: string; className: string }
> = {
  high: { label: 'High', className: 'bg-red-100 text-red-700 border-red-200' },
  medium: {
    label: 'Medium',
    className: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  },
  low: { label: 'Low', className: 'bg-blue-100 text-blue-700 border-blue-200' },
};

export function SkillGap() {
  const { skillGaps } = useLearnMate();

  if (!skillGaps) {
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Skill Gap Analysis</h1>
        <p className="text-muted-foreground">
          No skill gaps analyzed yet. Complete the onboarding to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {skillGaps._mock && <MockBanner />}

      <div>
        <h1 className="text-2xl font-bold">Skill Gap Analysis</h1>
        <p className="text-muted-foreground mt-1">
          Target role: <span className="font-medium">{skillGaps.target_role}</span>
        </p>
      </div>

      {skillGaps.gaps.length === 0 ? (
        <p className="text-muted-foreground">
          No skill gaps identified — you're ready for the role!
        </p>
      ) : (
        <ul className="space-y-4" aria-label="Skill gaps">
          {skillGaps.gaps.map((gap) => {
            const config = priorityConfig[gap.priority];
            return (
              <li
                key={gap.skill}
                className="rounded-lg border bg-card p-4 space-y-2"
              >
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-base">{gap.skill}</span>
                  <Badge
                    variant="outline"
                    className={config.className}
                    aria-label={`Priority: ${config.label}`}
                  >
                    {config.label}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{gap.rationale}</p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
