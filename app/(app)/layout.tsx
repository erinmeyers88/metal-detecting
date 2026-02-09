import AppShell from '../components/AppShell';
import AuthGate from '../components/AuthGate';
import FindsFilterProvider from '../components/FindsFilterProvider';
import UserLocationProvider from '../components/UserLocationProvider';
import MockDataProvider from '../components/MockDataProvider';

type AppLayoutProps = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    // <AuthGate>
      <UserLocationProvider>
        <MockDataProvider>
          <FindsFilterProvider>
            <AppShell>{children}</AppShell>
          </FindsFilterProvider>
        </MockDataProvider>
      </UserLocationProvider>
    // </AuthGate>
  );
}
