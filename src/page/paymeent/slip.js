import React, { useState, useEffect } from 'react';

const SlipComponent = () => {
  const [slips, setSlips] = useState([]);

  const getAllSlips = async () => {
    try {
      const response = await fetch('http://localhost:8000/slip/slips');
      const data = await response.json();
      setSlips(data);
    } catch (error) {
      console.error('Error fetching slips:', error);
    }
  };

  const updateSlip = async (id, updatedSlip) => {
    try {
      const response = await fetch(`http://localhost:8000/slip/slips/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedSlip)
      });
      const data = await response.json();
      setSlips(s => s.map(slip => (slip._id === id ? data.slip : slip)));
    } catch (error) {
      console.error('Error updating slip:', error);
    }
  };

  const deleteSlip = async (id) => {
    try {
      await fetch(`http://localhost:8000/slip/slips/${id}`, {
        method: 'DELETE'
      });
      setSlips(s => s.filter(slip => slip._id !== id));
    } catch (error) {
      console.error('Error deleting slip:', error);
    }
  };

  useEffect(() => {
    getAllSlips();
  }, []);

  return (
    <div className="container mt-5">
      <h1>Slips</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Email</th>
            <th>Photo</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {slips.map(slip => (
            <tr key={slip._id}>
              <td>{slip.userId}</td>
              <td>{slip.email}</td>
              <td>
                <img
                  src={`http://localhost:8000/payment/${slip.PhotoFileName}`}
                  alt="Profile"
                  className="img-fluid"
                  width={50}
                  height={150}
                />
              </td>
              <td>
                <button className="btn btn-success" onClick={() => updateSlip(slip._id, { ...slip, status: 'Accepted' })}>Accept</button>
                <button className="btn btn-danger" onClick={() => updateSlip(slip._id, { ...slip, status: 'Rejected' })}>Reject</button>
              </td>
              <td>
                <button className="btn btn-danger" onClick={() => deleteSlip(slip._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SlipComponent;
