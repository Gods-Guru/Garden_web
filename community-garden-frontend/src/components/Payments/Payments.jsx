import React, { useEffect, useState } from 'react';
import API from '../../api';
import './Payments.scss';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/payments/my')
      .then(res => setPayments(res.data.payments))
      .catch(() => setPayments([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="payments">Loading...</div>;

  return (
    <div className="payments">
      <h2>My Payments & Donations</h2>
      {payments.length === 0 ? (
        <div>No payments found.</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>Receipt</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p._id}>
                <td>{p.type}</td>
                <td>{p.amount}</td>
                <td>{p.status}</td>
                <td>{new Date(p.createdAt).toLocaleString()}</td>
                <td>{p.receiptUrl ? <a href={p.receiptUrl} target="_blank" rel="noopener noreferrer">View</a> : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Payments;
