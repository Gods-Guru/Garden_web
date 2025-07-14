import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, CheckSquare, Edit, Trash2 } from "lucide-react";
import { useState } from "react";

const AdminTasks = () => {
  // Mock data
  const tasks = [
    { id: 1, title: "Water Plot A-1", garden: "Downtown Community Garden", assignee: "Sarah Johnson", status: "Pending", priority: "High", dueDate: "2024-01-20" },
    { id: 2, title: "Harvest Lettuce", garden: "Downtown Community Garden", assignee: "Mike Chen", status: "In Progress", priority: "Medium", dueDate: "2024-01-22" },
    { id: 3, title: "Weed Control", garden: "Riverside Organic Farm", assignee: "Lisa Park", status: "Completed", priority: "Low", dueDate: "2024-01-18" },
  ];

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', priority: 'Medium', assignee: '' });
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Mock users
  const users = [
    'Sarah Johnson',
    'Mike Chen',
    'Lisa Park',
    'John Doe',
    'Emma Smith',
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectUser = (user: string) => {
    setForm({ ...form, assignee: user });
    setShowUserDropdown(false);
  };

  const handleCreate = () => {
    // Here you would handle task creation logic
    setShowModal(false);
    setForm({ title: '', description: '', priority: 'Medium', assignee: '' });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Task Management</h1>
            <p className="text-muted-foreground">Manage all tasks across gardens</p>
          </div>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Task
          </Button>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
              <h2 className="text-xl font-bold mb-4">Create New Task</h2>
              <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleCreate(); }}>
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="title">Title</label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={form.title}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
                    rows={3}
                  />
                </div>
                {/* User selection */}
                <div>
                  <label className="block text-sm font-medium mb-1">Assignee</label>
                  <div className="relative">
                    <button
                      type="button"
                      className="w-full border rounded px-3 py-2 text-left bg-gray-50 hover:bg-gray-100 focus:outline-none"
                      onClick={() => setShowUserDropdown((v) => !v)}
                    >
                      {form.assignee ? form.assignee : 'Select a user'}
                    </button>
                    {showUserDropdown && (
                      <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow-lg max-h-40 overflow-y-auto">
                        {users.map((user) => (
                          <div
                            key={user}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleSelectUser(user)}
                          >
                            {user}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="priority">Priority</label>
                  <select
                    id="priority"
                    name="priority"
                    value={form.priority}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    className="px-4 py-2 rounded border bg-gray-100 hover:bg-gray-200"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-primary text-white hover:bg-primary/90"
                  >
                    Create
                  </button>
                </div>
              </form>
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowModal(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckSquare className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{tasks.length}</p>
                  <p className="text-sm text-muted-foreground">Total Tasks</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task Title</TableHead>
                  <TableHead>Garden</TableHead>
                  <TableHead>Assignee</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell>{task.garden}</TableCell>
                    <TableCell>{task.assignee}</TableCell>
                    <TableCell>
                      <Badge variant={
                        task.status === 'Completed' ? 'default' :
                        task.status === 'In Progress' ? 'secondary' : 'outline'
                      }>
                        {task.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        task.priority === 'High' ? 'destructive' :
                        task.priority === 'Medium' ? 'secondary' : 'outline'
                      }>
                        {task.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>{task.dueDate}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
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

export default AdminTasks;