export const metadata = { title: 'Navkar Siddhi' };

export default function NavkarHeatmapPage() {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <iframe
        src="https://navkarsiddhi.vercel.app"
        title="Navkar Siddhi"
        className="h-full w-full border-0"
        allow="clipboard-read; clipboard-write"
      />
    </div>
  );
}
