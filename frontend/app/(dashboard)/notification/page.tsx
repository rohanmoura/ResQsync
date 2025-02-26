"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';

interface Notification {
    message: string;
    // You can add more fields as needed (e.g., timestamp, type, etc.)
}


const NotificationComponent = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [email, setEmail] = useState<string | null>(null);
    const [shouldSubscribe, setShouldSubscribe] = useState(false);
    const [loading, setLoading] = useState(true);

    // Fetch the user profile to obtain the email address and roles for notifications.
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
                // Assuming response.data contains email and roles
                const profile = response.data;
                setEmail(profile.email);
                if (profile.roles && profile.roles.includes("USER") && profile.roles.includes("VOLUNTEER")) {
                    setShouldSubscribe(true);
                } else {
                    setShouldSubscribe(false);
                }
            })
            .catch((error) => {
                console.error("Error fetching profile:", error);
            })
            .finally(() => setLoading(false));
    }, []);

    // Subscribe to notifications via SSE only if the user is a volunteer.
    useEffect(() => {
        if (!shouldSubscribe || !email) return;

        const sseUrl = `http://localhost:8081/api/notifications/subscribe?email=${encodeURIComponent(email)}`;
        const eventSource = new EventSource(sseUrl);

        eventSource.onmessage = (event) => {
            try {
                const notification: Notification = JSON.parse(event.data);
                setNotifications((prev) => [...prev, notification]);
            } catch (error) {
                console.error("Error parsing notification data:", error);
            }
        };

        eventSource.onerror = (error) => {
            console.error("EventSource error:", error);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, [shouldSubscribe, email]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    if (!shouldSubscribe) {
        return (
            <div className="p-4">
                <h2>Notifications</h2>
                <p>You are not a volunteer. No notifications available.</p>
            </div>
        );
    }

    return (
        <div className="p-4">
            <h2>Notifications for {email}</h2>
            {notifications.length === 0 ? (
                <p>No notifications yet.</p>
            ) : (
                <ul>
                    {notifications.map((notification, index) => (
                        <li key={index}>
                            {notification.message}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default NotificationComponent;
