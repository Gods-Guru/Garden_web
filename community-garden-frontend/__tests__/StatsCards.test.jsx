import { render, screen } from '@testing-library/react';
import StatsCards from '../src/components/Dashboard/StatsCards';

describe('StatsCards', () => {
  it('renders loading state', () => {
    render(<StatsCards stats={{}} loading={true} userRole="admin" />);
    expect(screen.getAllByText(/loading/i).length).toBeGreaterThan(0);
  });

  it('renders stats when not loading', () => {
    const stats = {
      totalGardens: 5,
      totalPlots: 20,
      activeTasks: 3,
      totalVolunteers: 10,
    };
    render(<StatsCards stats={stats} loading={false} userRole="admin" />);
    expect(screen.getByText('Total Gardens')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});
