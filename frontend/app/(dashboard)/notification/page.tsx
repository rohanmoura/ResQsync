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
  const [loading, setLoading] = useState(true);

  // Fetch the user profile to obtain the email address for notifications.
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
        // Assuming response.data.email contains the user's email
        setEmail(response.data.email);
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  // Subscribe to notifications via SSE once the email is available.
  useEffect(() => {
    if (!email) return;
    
    // Construct the URL to subscribe to notifications.
    const sseUrl = `http://localhost:8081/api/notifications/subscribe?email=${encodeURIComponent(email)}`;
    const eventSource = new EventSource(sseUrl);

    // Listen for incoming messages.
    eventSource.onmessage = (event) => {
      try {
        const notification: Notification = JSON.parse(event.data);
        setNotifications((prev) => [...prev, notification]);
      } catch (error) {
        console.error("Error parsing notification data:", error);
      }
    };

    // Handle any errors.
    eventSource.onerror = (error) => {
      console.error("EventSource error:", error);
      eventSource.close();
    };

    // Cleanup: close the connection when the component unmounts or email changes.
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
