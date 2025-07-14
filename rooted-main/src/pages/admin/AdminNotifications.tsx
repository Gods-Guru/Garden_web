import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Bell, Send, Eye } from "lucide-react";

const AdminNotifications = () => {
  // Mock data
  const notifications = [
    { id: 1, title: "Garden Approval Request", message: "New garden application requires approval", type: "Approval", status: "Pending", created: "2024-01-19" },
    { id: 2, title: "System Maintenance", message: "Scheduled maintenance tonight from 2-4 AM", type: "System", status: "Sent", created: "2024-01-18" },
    { id: 3, title: "Welcome New Members", message: "Welcome message for new garden members", type: "Welcome", status: "Sent", created: "2024-01-17" },
  ];

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: '',
    message: '',
    type: '',
    recipient: '',
  });
  const [showRecipientDropdown, setShowRecipientDropdown] = useState(false);

  // Mock types and recipients
  const types = ['Approval', 'System', 'Welcome', 'Reminder', 'Alert'];
  const recipients = [
    'All Users',
    'Garden Admins',
    'Sarah Johnson',
    'Mike Chen',
    'Lisa Park',
    'Community Group',
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectRecipient = (recipient: string) => {
    setForm({ ...form, recipient });
    setShowRecipientDropdown(false);
  };

  const handleCreate = () => {
    // Here you would handle notification creation logic
    setShowModal(false);
    setForm({ title: '', message: '', type: '', recipient: '' });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Notification Management</h1>
            <p className="text-muted-foreground">Manage system notifications and alerts</p>
          </div>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Notification
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{notifications.length}</p>
                  <p className="text-sm text-muted-foreground">Total Notifications</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notifications.map((notification) => (
                  <TableRow key={notification.id}>
                    <TableCell className="font-medium">{notification.title}</TableCell>
                    <TableCell className="max-w-xs truncate">{notification.message}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{notification.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={notification.status === 'Sent' ? 'default' : 'secondary'}>
                        {notification.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{notification.created}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Send className="h-4 w-4" />
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <h2 className="text-xl font-bold mb-4">Create New Notification</h2>
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
                <label className="block text-sm font-medium mb-1" htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="type">Type</label>
                <select
                  id="type"
                  name="type"
                  value={form.type}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
                  required
                >
                  <option value="">Select a type</option>
                  {types.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              {/* Recipient selection */}
              <div>
                <label className="block text-sm font-medium mb-1">Send To</label>
                <div className="relative">
                  <button
                    type="button"
                    className="w-full border rounded px-3 py-2 text-left bg-gray-50 hover:bg-gray-100 focus:outline-none"
                    onClick={() => setShowRecipientDropdown((v) => !v)}
                  >
                    {form.recipient ? form.recipient : 'Select recipient'}
                  </button>
                  {showRecipientDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow-lg max-h-40 overflow-y-auto">
                      {recipients.map((recipient) => (
                        <div
                          key={recipient}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleSelectRecipient(recipient)}
                        >
                          {recipient}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
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
    </AdminLayout>
  );
};

export default AdminNotifications;