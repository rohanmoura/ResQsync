import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            router.push("/"); // Redirect to landing page if no token
            return;
        }

        try {
            const decodedToken: any = jwtDecode(token);
            const isExpired = decodedToken.exp * 1000 < Date.now();

            if (isExpired) {
                localStorage.removeItem("jwtToken");
                router.push("/");
            } else {
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error("Invalid token:", error);
            localStorage.removeItem("jwtToken");
            router.push("/");
        }
    }, [router]);

    return isAuthenticated;
}
