import AppShell from '../components/AppShell';
import AuthGate from '../components/AuthGate';
import FindsFilterProvider from '../components/FindsFilterProvider';

type AppLayoutProps = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    // <AuthGate>
      <FindsFilterProvider>
        <AppShell>{children}</AppShell>
      </FindsFilterProvider>
    // </AuthGate>
  );
}
