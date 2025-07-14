import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar } from "@/components/ui/avatar";
import { ArrowLeft } from "lucide-react";

const Profile = () => {
  return (
    <div className="max-w-2xl mx-auto py-10">
      <div className="mb-4">
        <a href="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </a>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="mb-6 w-full">
              <TabsTrigger value="info">Profile Info</TabsTrigger>
              <TabsTrigger value="edit">Edit Profile</TabsTrigger>
              <TabsTrigger value="password">Change Password</TabsTrigger>
            </TabsList>
            <TabsContent value="info">
              <div className="flex flex-col items-center mb-6">
                <Avatar className="w-24 h-24 mb-4" />
                <h2 className="text-xl font-semibold mb-1">Sarah Green</h2>
                <p className="text-muted-foreground mb-2">sarah.green@email.com</p>
              </div>
            </TabsContent>
            <TabsContent value="edit">
              <form className="space-y-6">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" type="text" defaultValue="Sarah Green" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="sarah.green@email.com" />
                </div>
                <div>
                  <Label htmlFor="avatar">Avatar</Label>
                  <Input id="avatar" type="file" />
                </div>
                <div className="flex space-x-4">
                  <Button type="submit">Save</Button>
                  <Button type="button" variant="outline">Cancel</Button>
                </div>
              </form>
            </TabsContent>
            <TabsContent value="password">
              <form className="space-y-6">
                <div>
                  <Label htmlFor="current">Current Password</Label>
                  <Input id="current" type="password" />
                </div>
                <div>
                  <Label htmlFor="new">New Password</Label>
                  <Input id="new" type="password" />
                </div>
                <div>
                  <Label htmlFor="confirm">Confirm New Password</Label>
                  <Input id="confirm" type="password" />
                </div>
                <div className="flex space-x-4">
                  <Button type="submit">Save</Button>
                  <Button type="button" variant="outline">Cancel</Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile; 