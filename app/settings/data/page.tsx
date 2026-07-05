'use client';

import { useUser, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { useEffect, useState } from 'react';
import { Download, Trash2, FileJson, FileSpreadsheet, Loader2, ExternalLink } from 'lucide-react';

export default function SettingsDataPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const { toast } = useToast();
  const [exporting, setExporting] = useState<'json' | 'csv' | null>(null);

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.push('/sign-in');
  }, [isLoaded, isSignedIn, router]);

  const handleExport = async (format: 'json' | 'csv') => {
    setExporting(format);
    try {
      const res = await fetch(`/api/profile/export?format=${format}`);
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `jainzbharat-profile-export.${format}`;
      a.click();
      URL.revokeObjectURL(url);
      toast('Data exported successfully', 'success');
    } catch {
      toast('Failed to export data', 'error');
    }
    setExporting(null);
  };

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="font-heading text-lg font-semibold">Export Your Data</h2>
        <p className="mt-1 text-sm text-muted-foreground">Download a copy of your profile data and contributions</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => handleExport('json')} disabled={exporting !== null}>
            {exporting === 'json' ? <Loader2 className="size-4 animate-spin" /> : <FileJson className="size-4" />}
            Export as JSON
          </Button>
          <Button variant="outline" onClick={() => handleExport('csv')} disabled={exporting !== null}>
            {exporting === 'csv' ? <Loader2 className="size-4 animate-spin" /> : <FileSpreadsheet className="size-4" />}
            Export as CSV
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="font-heading text-lg font-semibold">Delete Your Data</h2>
        <p className="mt-1 text-sm text-muted-foreground">Request permanent deletion of your account and all associated data</p>
        <div className="mt-4 space-y-3">
          <p className="text-xs text-muted-foreground">
            Deleting your account will remove your profile, messages, community memberships, and stored files. 
            Some content (like discussion posts or event contributions) may be anonymized rather than deleted.
            Account deletion is processed after a 30-day recovery window.
          </p>
          <Button variant="danger" onClick={async () => {
            if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;
            if (!window.confirm('This will permanently delete your profile, messages, and all data. Continue?')) return;
            try {
              const res = await fetch('/api/profile/delete', { method: 'DELETE' });
              if (!res.ok) throw new Error('Delete failed');
              await signOut();
              router.push('/');
            } catch {
              toast('Failed to delete account', 'error');
            }
          }}>
            <Trash2 className="size-4" />
            Delete My Account
          </Button>
        </div>
      </Card>
    </div>
  );
}
