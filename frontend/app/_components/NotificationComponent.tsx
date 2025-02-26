"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Notification {
    message: string;
    timestamp?: string; // Optional timestamp field for relative time
}

interface NotificationProps {
    onNewNotification?: () => void; // New optional callback
}

export default function NotificationComponent({ onNewNotification }: NotificationProps) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [email, setEmail] = useState<string | null>(null);
    const [shouldSubscribe, setShouldSubscribe] = useState(false);
    const [loading, setLoading] = useState(true);

    // Fetch user profile to obtain email and roles for notifications.
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

    // Subscribe to notifications via SSE only if the user should receive notifications.
    useEffect(() => {
        if (!shouldSubscribe || !email) return;

        const sseUrl = `http://localhost:8081/api/notifications/subscribe?email=${encodeURIComponent(email)}`;
        const eventSource = new EventSource(sseUrl);

        eventSource.onmessage = (event) => {
            try {
                const notification: Notification = JSON.parse(event.data);
                setNotifications((prev) => [...prev, notification]);

                // Call the parent's callback to increment the unread count
                if (onNewNotification) {
                    onNewNotification();
                }
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
    }, [shouldSubscribe, email, onNewNotification]);

    // Function to compute relative time from a timestamp.
    const computeRelativeTime = (timestamp: string): string => {
        const now = Date.now();
        const then = new Date(timestamp).getTime();
        const diff = now - then;
        const seconds = Math.floor(diff / 1000);
        if (seconds < 60) return `${seconds} seconds ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} minutes ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hours ago`;
        const days = Math.floor(hours / 24);
        return `${days} days ago`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-4">
                <p>Loading...</p>
            </div>
        );
    }

    if (!shouldSubscribe) {
        return (
            <div className="p-4">
                <p>You are not a volunteer. No notifications available.</p>
            </div>
        );
    }

    return (
        <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Notifications for {email}</h2>
            {notifications.length === 0 ? (
                <p>No notifications yet.</p>
            ) : (
                <ul className="space-y-4">
                    {notifications.map((notification, index) => (
                        <li key={index} className="border-b pb-2">
                            <div className="text-sm">{notification.message}</div>
                            {notification.timestamp && (
                                <div className="text-xs text-muted-foreground">
                                    {computeRelativeTime(notification.timestamp)}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
