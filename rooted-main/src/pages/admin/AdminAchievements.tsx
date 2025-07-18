import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trophy, Edit, Trash2 } from "lucide-react";
import { useState } from "react";

const AdminAchievements = () => {
  // Mock data
  const achievements = [
    { id: 1, title: "First Harvest", description: "Complete your first harvest", category: "Milestone", difficulty: "Easy", earned: 45 },
    { id: 2, title: "Water Warrior", description: "Log 30 days of watering", category: "Consistency", difficulty: "Medium", earned: 23 },
    { id: 3, title: "Community Leader", description: "Help 10 new gardeners", category: "Social", difficulty: "Hard", earned: 8 },
  ];

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'Easy',
    user: '',
  });
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Mock categories, difficulties, and users
  const categories = ['Milestone', 'Consistency', 'Social', 'Participation'];
  const difficulties = ['Easy', 'Medium', 'Hard'];
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
    setForm({ ...form, user });
    setShowUserDropdown(false);
  };

  const handleCreate = () => {
    // Here you would handle achievement creation logic
    setShowModal(false);
    setForm({ title: '', description: '', category: '', difficulty: 'Easy', user: '' });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Achievement Management</h1>
            <p className="text-muted-foreground">Manage achievements and progress tracking</p>
          </div>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Achievement
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{achievements.length}</p>
                  <p className="text-sm text-muted-foreground">Total Achievements</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Times Earned</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {achievements.map((achievement) => (
                  <TableRow key={achievement.id}>
                    <TableCell className="font-medium">{achievement.title}</TableCell>
                    <TableCell>{achievement.description}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{achievement.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        achievement.difficulty === 'Hard' ? 'destructive' :
                        achievement.difficulty === 'Medium' ? 'secondary' : 'outline'
                      }>
                        {achievement.difficulty}
                      </Badge>
                    </TableCell>
                    <TableCell>{achievement.earned}</TableCell>
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <h2 className="text-xl font-bold mb-4">Create New Achievement</h2>
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
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="difficulty">Difficulty</label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={form.difficulty}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
                >
                  {difficulties.map((diff) => (
                    <option key={diff} value={diff}>{diff}</option>
                  ))}
                </select>
              </div>
              {/* User selection */}
              <div>
                <label className="block text-sm font-medium mb-1">Give to User</label>
                <div className="relative">
                  <button
                    type="button"
                    className="w-full border rounded px-3 py-2 text-left bg-gray-50 hover:bg-gray-100 focus:outline-none"
                    onClick={() => setShowUserDropdown((v) => !v)}
                  >
                    {form.user ? form.user : 'Select a user'}
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

export default AdminAchievements;