import { useAuth } from "@/hooks/useAuth ";

export function withAuth(Component: React.ComponentType) {
    return function AuthenticatedComponent(props: any) {
        const isAuthenticated = useAuth();
        if (!isAuthenticated) {
            return null; // Prevent rendering until redirect happens
        }
        return <Component {...props} />;
    };
}
