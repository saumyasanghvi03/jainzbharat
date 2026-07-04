'use client';
export default function GlobalError({ reset }: { error: Error; reset: () => void }) { return <html lang="en"><body><main style={{padding: 48, fontFamily: 'system-ui', background: '#05060a', color: '#fff', minHeight: '100vh'}}><h1>JainZBharat encountered an error</h1><button onClick={reset}>Try again</button></main></body></html>; }
