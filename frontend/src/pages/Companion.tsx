import { useState, useEffect, useRef } from 'react';
import { Send, Loader2 } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { useLearnMate } from '@/context/LearnMateContext';
import { sendCompanionMessage, ApiError } from '@/api/client';

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function Companion() {
  const { chatHistory, addChatMessage } = useLearnMate();
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestedActions, setSuggestedActions] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  async function send(message: string) {
    if (!message.trim() || sending) return;
    setError(null);
    setSuggestedActions([]);

    const userMsg = {
      role: 'user' as const,
      content: message,
      timestamp: new Date().toISOString(),
    };
    addChatMessage(userMsg);
    setInput('');
    setSending(true);

    try {
      const res = await sendCompanionMessage(message);
      addChatMessage({
        role: 'assistant',
        content: res.response,
        timestamp: new Date().toISOString(),
      });
      setSuggestedActions(res.suggested_actions ?? []);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to send message. Please try again.');
      }
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void send(input);
    }
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">AI Learning Companion</h1>
        <p className="text-muted-foreground mt-1">
          Ask anything about your learning journey.
        </p>
      </div>

      {/* Message list */}
      <div
        className="flex-1 overflow-y-auto rounded-lg border bg-muted/30 p-4 space-y-4"
        aria-live="polite"
        aria-label="Conversation"
      >
        {chatHistory.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-8">
            Start a conversation with your AI learning companion.
          </p>
        ) : (
          chatHistory.map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={idx}
                className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${
                    isUser
                      ? 'bg-zinc-100 text-zinc-900'
                      : 'bg-white border text-foreground'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <p className="mt-1 text-xs text-muted-foreground text-right">
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} aria-hidden="true" />
      </div>

      {/* Suggested actions */}
      {suggestedActions.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {suggestedActions.map((action) => (
            <button
              key={action}
              type="button"
              onClick={() => void send(action)}
              disabled={sending}
            >
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-accent text-xs"
              >
                {action}
              </Badge>
            </button>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-sm text-destructive pt-1">{error}</p>
      )}

      {/* Input row */}
      <div className="flex gap-2 pt-3">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask your companion…"
          disabled={sending}
          aria-label="Message input"
          className="flex-1"
        />
        <Button
          type="button"
          onClick={() => void send(input)}
          disabled={sending || !input.trim()}
          aria-label="Send message"
        >
          {sending ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Send className="h-4 w-4" aria-hidden="true" />
          )}
        </Button>
      </div>
    </div>
  );
}
