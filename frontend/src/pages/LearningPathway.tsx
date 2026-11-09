import { useState } from 'react';
import { Loader2, CheckCircle2, Circle, ChevronRight } from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { MockBanner } from '@/components/MockBanner';

import { useLearnMate } from '@/context/LearnMateContext';
import { adaptPathway, ApiError } from '@/api/client';

export function LearningPathway() {
  const { pathway, progress, setPathway } = useLearnMate();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [adapting, setAdapting] = useState(false);
  const [adaptError, setAdaptError] = useState<string | null>(null);

  async function handleAdapt() {
    if (!feedback.trim()) return;
    setAdapting(true);
    setAdaptError(null);
    try {
      const updated = await adaptPathway(feedback, progress.completed);
      setPathway(updated);
      setSheetOpen(false);
      setFeedback('');
    } catch (err) {
      if (err instanceof ApiError) {
        setAdaptError(err.message);
      } else {
        setAdaptError('Failed to adapt pathway. Please try again.');
      }
    } finally {
      setAdapting(false);
    }
  }

  if (!pathway) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-8 w-48" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-36 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {pathway._mock && <MockBanner />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Learning Pathway</h1>
          <p className="text-muted-foreground mt-1">
            {pathway.target_role} · ~{pathway.estimated_duration_weeks} weeks
          </p>
        </div>
        <Button variant="outline" onClick={() => setSheetOpen(true)}>
          Adapt My Pathway
        </Button>
      </div>

      {/* Vertical stepper */}
      <ol className="relative space-y-0">
        {pathway.milestones
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((milestone, idx) => {
            const isCompleted = progress.completed.includes(milestone.id);
            const isLast = idx === pathway.milestones.length - 1;
            return (
              <li key={milestone.id} className="flex gap-4">
                {/* Connector column */}
                <div className="flex flex-col items-center">
                  {isCompleted ? (
                    <CheckCircle2 className="h-6 w-6 text-green-600 shrink-0" aria-label="Completed" />
                  ) : (
                    <Circle className="h-6 w-6 text-muted-foreground shrink-0" aria-label="Not completed" />
                  )}
                  {!isLast && (
                    <div className="w-px flex-1 bg-border my-1" aria-hidden="true" />
                  )}
                </div>

                {/* Card */}
                <Card className={`mb-4 flex-1 ${isCompleted ? 'opacity-70' : ''}`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle className={`text-base ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                        {milestone.title}
                      </CardTitle>
                      <Badge variant={isCompleted ? 'secondary' : 'default'}>
                        {isCompleted ? 'Done' : `Step ${milestone.order}`}
                      </Badge>
                    </div>
                    <CardDescription>{milestone.description}</CardDescription>
                  </CardHeader>
                  {milestone.resources.length > 0 && (
                    <CardContent>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                        Resources
                      </p>
                      <ul className="space-y-1">
                        {milestone.resources.map((r) => (
                          <li key={r} className="flex items-center gap-1 text-sm">
                            <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" aria-hidden="true" />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  )}
                </Card>
              </li>
            );
          })}
      </ol>

      {/* Adapt Pathway Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="flex flex-col gap-4">
          <SheetHeader>
            <SheetTitle>Adapt My Pathway</SheetTitle>
          </SheetHeader>
          <p className="text-sm text-muted-foreground">
            Tell us how your goals or circumstances have changed and we'll
            update your pathway accordingly.
          </p>
          {adaptError && (
            <Alert variant="destructive">
              <AlertDescription>{adaptError}</AlertDescription>
            </Alert>
          )}
          <Textarea
            placeholder="e.g. I've completed the SQL basics and want to focus more on cloud technologies…"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={6}
            aria-label="Pathway adaptation feedback"
          />
          <SheetFooter>
            <Button
              onClick={handleAdapt}
              disabled={adapting || !feedback.trim()}
              className="w-full"
            >
              {adapting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              )}
              {adapting ? 'Adapting…' : 'Update Pathway'}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
