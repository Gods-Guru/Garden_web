import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Droplets } from "lucide-react";

const AdminWater = () => {
  // Mock data
  const waterLogs = [
    { id: 1, garden: "Downtown Community Garden", plot: "Plot A-1", user: "Sarah Johnson", amount: "15L", date: "2024-01-19", time: "08:30 AM" },
    { id: 2, garden: "Riverside Organic Farm", plot: "Plot B-2", user: "Mike Chen", amount: "12L", date: "2024-01-19", time: "07:45 AM" },
    { id: 3, garden: "School District Garden", plot: "Plot C-1", user: "Lisa Park", amount: "8L", date: "2024-01-18", time: "06:15 PM" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Water Management</h1>
          <p className="text-muted-foreground">Monitor water usage across all gardens</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Droplets className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">35L</p>
                  <p className="text-sm text-muted-foreground">Today's Usage</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Water Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Garden</TableHead>
                  <TableHead>Plot</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {waterLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{log.garden}</TableCell>
                    <TableCell>{log.plot}</TableCell>
                    <TableCell>{log.user}</TableCell>
                    <TableCell className="font-medium">{log.amount}</TableCell>
                    <TableCell>{log.date}</TableCell>
                    <TableCell>{log.time}</TableCell>
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

export default AdminWater;