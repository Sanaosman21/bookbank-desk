import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Sun, Moon, Bell, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Settings = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [profilePublic, setProfilePublic] = useState(false);
  const [showEmail, setShowEmail] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
      }
    };
    checkAuth();

    // Load settings from localStorage
    const savedSettings = localStorage.getItem("bookbank-settings");
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setEmailNotifications(settings.emailNotifications ?? true);
      setPushNotifications(settings.pushNotifications ?? false);
      setProfilePublic(settings.profilePublic ?? false);
      setShowEmail(settings.showEmail ?? true);
    }
  }, [navigate]);

  const saveSettings = () => {
    const settings = {
      emailNotifications,
      pushNotifications,
      profilePublic,
      showEmail,
    };
    localStorage.setItem("bookbank-settings", JSON.stringify(settings));
    toast.success("Settings saved successfully");
  };

  const handleThemeToggle = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
    toast.success(`${checked ? "Dark" : "Light"} mode enabled`);
  };

  const handleNotificationToggle = (type: "email" | "push", checked: boolean) => {
    if (type === "email") {
      setEmailNotifications(checked);
    } else {
      setPushNotifications(checked);
    }
  };

  const handlePrivacyToggle = (type: "profile" | "email", checked: boolean) => {
    if (type === "profile") {
      setProfilePublic(checked);
    } else {
      setShowEmail(checked);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-3xl mx-auto pt-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="space-y-6">
          {/* Appearance Settings */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                Appearance
              </CardTitle>
              <CardDescription>
                Customize how BookBank looks on your device
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode" className="text-base">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable dark theme for reduced eye strain
                  </p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={theme === "dark"}
                  onCheckedChange={handleThemeToggle}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>
                Manage how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notif" className="text-base">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive updates about your subjects via email
                  </p>
                </div>
                <Switch
                  id="email-notif"
                  checked={emailNotifications}
                  onCheckedChange={(checked) => handleNotificationToggle("email", checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-notif" className="text-base">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get instant notifications in your browser
                  </p>
                </div>
                <Switch
                  id="push-notif"
                  checked={pushNotifications}
                  onCheckedChange={(checked) => handleNotificationToggle("push", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Privacy & Security
              </CardTitle>
              <CardDescription>
                Control your privacy and data visibility
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="public-profile" className="text-base">Public Profile</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow others to view your profile information
                  </p>
                </div>
                <Switch
                  id="public-profile"
                  checked={profilePublic}
                  onCheckedChange={(checked) => handlePrivacyToggle("profile", checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="show-email" className="text-base flex items-center gap-2">
                    Show Email Address
                    {showEmail ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Display your email on your public profile
                  </p>
                </div>
                <Switch
                  id="show-email"
                  checked={showEmail}
                  onCheckedChange={(checked) => handlePrivacyToggle("email", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <Button onClick={saveSettings} className="w-full" size="lg">
            Save All Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
