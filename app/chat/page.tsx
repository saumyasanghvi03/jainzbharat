'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Card } from '@/components/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { MessageSquare, Send, Users } from 'lucide-react';

export default function ChatPage() {
  const { isSignedIn } = useUser();
  const { toast } = useToast();
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!message.trim()) return;
    toast('Real-time messaging will be available in the next update.', 'info');
    setMessage('');
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 md:px-6">
      <Badge variant="default">Community Chat</Badge>
      <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight md:text-6xl">Community Chat</h1>
      <p className="mt-2 text-muted-foreground">Real-time messaging with fellow community members.</p>

      <Card className="mt-8 flex h-[60vh] flex-col">
        <div className="flex items-center gap-2 border-b border-border pb-4">
          <Users className="size-5 text-muted-foreground" />
          <span className="font-heading text-sm font-semibold">General Chat</span>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <MessageSquare className="mx-auto size-12 text-muted-foreground/40" />
            <p className="mt-3 text-sm text-muted-foreground">
              {isSignedIn
                ? 'Real-time chat will be available in the next update.'
                : 'Sign in to access community chat.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-border pt-4">
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            disabled={!isSignedIn}
          />
          <Button size="icon" onClick={handleSend} disabled={!isSignedIn}>
            <Send className="size-4" />
          </Button>
        </div>
      </Card>
    </section>
  );
}
