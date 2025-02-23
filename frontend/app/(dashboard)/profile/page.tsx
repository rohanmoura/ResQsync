import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export default function ProfilePage() {
    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Profile Header */}
            <Card>
                <CardHeader className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                        <AvatarImage src="/user-avatar.png" alt="User" />
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-xl font-semibold">John Doe</CardTitle>
                        <p className="text-muted-foreground text-sm">johndoe@example.com</p>
                    </div>
                </CardHeader>
            </Card>

            {/* User Info Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Edit Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" placeholder="John Doe" />
                    </div>
                    <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea id="bio" placeholder="Write something about yourself..." />
                    </div>
                    <Button>Save Changes</Button>
                </CardContent>
            </Card>

            {/* Account Settings */}
            <Card>
                <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label>Dark Mode</Label>
                        <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label>Email Notifications</Label>
                        <Switch />
                    </div>
                    <Separator />
                    <Button variant="destructive">Delete Account</Button>
                </CardContent>
            </Card>
        </div>
    );
}
