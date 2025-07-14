import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MessageSquare, Edit, Trash2, Eye } from "lucide-react";

const AdminForum = () => {
  // Mock data
  const posts = [
    { id: 1, title: "Best Tomato Varieties for Summer", author: "Sarah Johnson", garden: "Downtown Community Garden", replies: 12, status: "Active", created: "2024-01-18" },
    { id: 2, title: "Organic Pest Control Methods", author: "Mike Chen", garden: "Riverside Organic Farm", replies: 8, status: "Active", created: "2024-01-17" },
    { id: 3, title: "Watering Schedule Tips", author: "Lisa Park", garden: "School District Garden", replies: 5, status: "Flagged", created: "2024-01-16" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Forum Management</h1>
            <p className="text-muted-foreground">Moderate community forum posts and discussions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{posts.length}</p>
                  <p className="text-sm text-muted-foreground">Total Posts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Forum Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Post Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Garden</TableHead>
                  <TableHead>Replies</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>{post.author}</TableCell>
                    <TableCell>{post.garden}</TableCell>
                    <TableCell>{post.replies}</TableCell>
                    <TableCell>
                      <Badge variant={post.status === 'Flagged' ? 'destructive' : 'default'}>
                        {post.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{post.created}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminForum;