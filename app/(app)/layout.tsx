import AppShell from '../components/AppShell';
import AuthGate from '../components/AuthGate';

type AppLayoutProps = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    // <AuthGate>
      <AppShell>{children}</AppShell>
    // </AuthGate>
  );
}
