import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, X } from 'lucide-react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { useLearnMate } from '@/context/LearnMateContext';
import { startSession, analyzeSkills, generatePathway } from '@/api/client';
import { ApiError } from '@/api/client';

const schema = z.object({
  target_role: z.string().min(2, 'Target role is required'),
  hours: z.number().min(1).max(40),
});

type FormValues = z.infer<typeof schema>;

export function Onboarding() {
  const navigate = useNavigate();
  const {
    setSessionId,
    setProfile,
    setSkillGaps,
    setPathway,
    setProgress,
    profile,
  } = useLearnMate();

  const [skills, setSkills] = useState<string[]>(
    profile?.current_skills ?? [],
  );
  const [skillInput, setSkillInput] = useState('');
  const [interests, setInterests] = useState<string[]>(
    profile?.interests ?? [],
  );
  const [interestInput, setInterestInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      target_role: profile?.target_role ?? '',
      hours: profile?.time_available_hours_per_week ?? 10,
    },
  });

  function addTag(
    value: string,
    list: string[],
    setList: (v: string[]) => void,
    setInput: (v: string) => void,
  ) {
    const trimmed = value.trim();
    if (trimmed && !list.includes(trimmed)) {
      setList([...list, trimmed]);
    }
    setInput('');
  }

  function removeTag(
    tag: string,
    list: string[],
    setList: (v: string[]) => void,
  ) {
    setList(list.filter((t) => t !== tag));
  }

  function handleTagKeyDown(
    e: KeyboardEvent<HTMLInputElement>,
    value: string,
    list: string[],
    setList: (v: string[]) => void,
    setInput: (v: string) => void,
  ) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(value, list, setList, setInput);
    }
  }

  async function onSubmit(values: FormValues) {
    setError(null);
    setLoading(true);

    const learnerProfile = {
      target_role: values.target_role,
      current_skills: skills,
      interests,
      time_available_hours_per_week: values.hours,
    };

    try {
      const session = await startSession(learnerProfile);
      setSessionId(session.session_id);
      setProfile(learnerProfile);

      const [gaps, pathway] = await Promise.all([
        analyzeSkills(skills, values.target_role),
        generatePathway(learnerProfile),
      ]);

      setSkillGaps(gaps);
      setPathway(pathway);
      setProgress({
        milestones: pathway.milestones.map((m) => m.id),
        completed: pathway.milestones
          .filter((m) => m.completed)
          .map((m) => m.id),
      });

      navigate('/pathway');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Welcome to LearnMate AI</h1>
        <p className="text-muted-foreground mt-1">
          Tell us about yourself and we'll build a personalised learning pathway.
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Learner Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Target role */}
              <FormField
                control={form.control}
                name="target_role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Role</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Data Engineer, Frontend Developer"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Current Skills */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">
                  Current Skills
                </label>
                <div className="flex flex-wrap gap-2 min-h-[2.25rem] rounded-md border border-input bg-background px-3 py-2">
                  {skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="gap-1">
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeTag(skill, skills, setSkills)}
                        aria-label={`Remove ${skill}`}
                        className="hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  <input
                    className="flex-1 min-w-[8rem] bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    placeholder="Type a skill and press Enter"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) =>
                      handleTagKeyDown(e, skillInput, skills, setSkills, setSkillInput)
                    }
                    onBlur={() =>
                      addTag(skillInput, skills, setSkills, setSkillInput)
                    }
                  />
                </div>
              </div>

              {/* Interests */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">
                  Interests
                </label>
                <div className="flex flex-wrap gap-2 min-h-[2.25rem] rounded-md border border-input bg-background px-3 py-2">
                  {interests.map((interest) => (
                    <Badge key={interest} variant="secondary" className="gap-1">
                      {interest}
                      <button
                        type="button"
                        onClick={() =>
                          removeTag(interest, interests, setInterests)
                        }
                        aria-label={`Remove ${interest}`}
                        className="hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  <input
                    className="flex-1 min-w-[8rem] bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    placeholder="Type an interest and press Enter"
                    value={interestInput}
                    onChange={(e) => setInterestInput(e.target.value)}
                    onKeyDown={(e) =>
                      handleTagKeyDown(
                        e,
                        interestInput,
                        interests,
                        setInterests,
                        setInterestInput,
                      )
                    }
                    onBlur={() =>
                      addTag(
                        interestInput,
                        interests,
                        setInterests,
                        setInterestInput,
                      )
                    }
                  />
                </div>
              </div>

              {/* Hours per week */}
              <FormField
                control={form.control}
                name="hours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Hours per week:{' '}
                      <span className="font-bold">{field.value}</span>
                    </FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={40}
                        step={1}
                        value={[field.value]}
                        onValueChange={([v]) => field.onChange(v)}
                        aria-label="Hours per week"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={loading} className="w-full">
                {loading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                )}
                {loading ? 'Building your pathway…' : 'Get Started'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
