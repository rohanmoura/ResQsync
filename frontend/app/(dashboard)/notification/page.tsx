"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Notification {
    message: string;
    // add other fields if needed
}


const NotificationComponent = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const [email, setEmail] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch the user profile to get the email
    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            setLoading(false);
            return;
        }
        axios
            .get("http://localhost:8081/api/user/profile", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setEmail(response.data.email);
            })
            .catch((error) => {
                console.error("Error fetching profile:", error);
            })
            .finally(() => setLoading(false));
    }, []);

    // Subscribe to notifications once email is available
    useEffect(() => {
        if (!email) return;
        const eventSource = new EventSource(
            `http://localhost:8080/api/notifications/subscribe?email=${email}`
        );

        eventSource.onmessage = (event) => {
            try {
                const notification = JSON.parse(event.data);
                setNotifications((prevNotifications) => [...prevNotifications, notification]);
            } catch (error) {
                console.error("Error parsing notification data:", error);
            }
        };

        eventSource.onerror = (error) => {
            console.error('EventSource failed:', error);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, [email]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div>
            <h2>Notifications for {email}</h2>
            <ul>
                {notifications.map((notification, index) => (
                    <li key={index}>{notification?.message || "No message"}</li>
                ))}
            </ul>

        </div>
    );
};

export default NotificationComponent;
