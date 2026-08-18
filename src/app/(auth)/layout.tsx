export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="mb-10 flex flex-col items-center gap-2 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground shadow-sm">
            L
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Life Manager</h1>
          <p className="text-sm text-muted-foreground">毎日の行動を可視化し、成長を続けよう</p>
        </div>
        {children}
      </div>
    </main>
  );
}
