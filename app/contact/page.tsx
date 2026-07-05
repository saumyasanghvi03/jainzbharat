'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast';
import { Mail, MessageSquare, Shield, Bug, Send } from 'lucide-react';

export default function ContactPage() {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const channels = [
    { icon: Mail, title: 'General Inquiries', email: 'hello@jainzbharat.org', desc: 'For general questions, partnerships, and media inquiries.' },
    { icon: Shield, title: 'Privacy & Legal', email: 'legal@jainzbharat.org', desc: 'For privacy, data requests, and legal matters.' },
    { icon: Bug, title: 'Security', email: 'security@jainzbharat.org', desc: 'To report security vulnerabilities responsibly.' },
    { icon: MessageSquare, title: 'Moderation', email: 'moderation@jainzbharat.org', desc: 'To appeal moderation decisions or report content.' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast('Please fill in all required fields', 'error');
      return;
    }
    setSending(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });
      if (!res.ok) throw new Error('Failed');
      toast('Message sent successfully! We will respond within 48 hours.', 'success');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch {
      toast('Failed to send message. Please email us directly.', 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <Badge variant="default">Contact</Badge>
      <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight md:text-6xl">Get in Touch</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">We&rsquo;d love to hear from you. Choose the best channel for your inquiry.</p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {channels.map((c) => {
          const Icon = c.icon;
          return (
            <Card key={c.email}>
              <Icon className="size-8 text-primary" />
              <h3 className="mt-3 font-heading text-lg font-semibold">{c.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
              <a href={`mailto:${c.email}`} className="mt-3 inline-block text-sm font-medium text-primary hover:underline">{c.email}</a>
            </Card>
          );
        })}
      </div>

      <Card className="mt-8 p-8">
        <h2 className="font-heading text-2xl font-semibold">Send a Message</h2>
        <p className="mt-1 text-sm text-muted-foreground">We aim to respond within 48 hours.</p>
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Name *</label>
              <Input placeholder="Your name" className="mt-1" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div>
              <label className="text-sm font-medium">Email *</label>
              <Input type="email" placeholder="your@email.com" className="mt-1" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Subject</label>
            <Input placeholder="What is this about?" className="mt-1" value={subject} onChange={e => setSubject(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium">Message *</label>
            <Textarea placeholder="Your message..." className="mt-1" rows={6} value={message} onChange={e => setMessage(e.target.value)} required />
          </div>
          <Button type="submit" disabled={sending}>
            <Send className="mr-2 size-4" /> {sending ? 'Sending...' : 'Send Message'}
          </Button>
        </form>
      </Card>
    </section>
  );
}
