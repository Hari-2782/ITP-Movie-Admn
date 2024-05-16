import { faEdit, faThumbsDown, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const FeedbackList = ({ userId, onDelete, onUpdate, onPost }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [newFeedback, setNewFeedback] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [feedbacks, setFeedbacks] = useState([]);
  const [User, setUser] = useState();

  useEffect(() => {
    getFeedback();
    getUserData();
  }, []);

  const calculateAverageRating = () => {
    if (feedbacks.length === 0) {
      return 0;
    }
    const totalRating = feedbacks.reduce((acc, feedback) => acc + parseInt(feedback.rating), 0);
    return totalRating / feedbacks.length;
  };

  const getFeedback = async () => {
    try {
      const response = await fetch("http://localhost:8000/feedback");
      const data = await response.json();
      setFeedbacks(data);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleEdit = (feedback) => {
    setSelectedFeedback(feedback);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:8000/feedback/${id}`, {
        method: 'DELETE'
      });
      setFeedbacks(feedbacks.filter((feedback) => feedback._id !== id));
      onDelete && onDelete(id);
    } catch (error) {
      console.error("Error deleting feedback:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:8000/feedback/${selectedFeedback._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(selectedFeedback)
      });
      const data = await response.json();
      if (data.message === 'Feedback updated successfully') {
        setFeedbacks(feedbacks.map((feedback) =>
          feedback._id === selectedFeedback._id ? selectedFeedback : feedback
        ));
        setShowModal(false);
        onUpdate && onUpdate(selectedFeedback);
      }
    } catch (error) {
      console.error("Error updating feedback:", error);
    }
  };

  const handlePost = async () => {
    try {
      const response = await fetch('http://localhost:8000/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: User._id,
          feedback: newFeedback,
          name: User.name,
          email: User.email,
          rating: newRating
        })
      });
      const data = await response.json();
      if (response.ok) {
        setFeedbacks([...feedbacks, data.feedback]);
        setNewFeedback('');
        setNewRating(0);
        onPost && onPost(data.feedback);
      } else {
        console.error("Failed to post feedback:", data.message);
      }
    } catch (error) {
      console.error("Error posting feedback:", error);
    }
  };

  const getUserData = async () => {
    try {
      const response = await fetch("http://localhost:8000/user/getuser", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      const data = await response.json();
      if (data.ok) {
        setUser(data.data);
      } else {
        console.log(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleApprove = async (feedbackId) => {
    try {
      await fetch(`http://localhost:8000/feedback/approve/${feedbackId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      // Implement the logic for handling approval (e.g., updating UI, showing success message)
    } catch (error) {
      console.error("Error approving feedback:", error);
    }
  };

  const handleReject = async (feedbackId) => {
    try {
      await fetch(`http://localhost:8000/feedback/reject/${feedbackId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      // Implement the logic for handling rejection (e.g., updating UI, showing success message)
    } catch (error) {
      console.error("Error rejecting feedback:", error);
    }
  };

  const handleSendEmail = async (toEmail, userName, packageType) => {
    try {
      const response = await fetch(`http://localhost:8000/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          toEmail,
          userName,
          packageType
        })
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Email sent successfully');
        // Implement the logic for handling email sent (e.g., showing success message)
      } else {
        console.error("Failed to send email:", data.message);
      }
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  const handlePrintPDF = () => {
    const doc = new jsPDF();
    
    // Set font size and style for the title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    
    // Add the title and center it
    doc.text("Bala Cinema Feedback", doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

    // Define the columns you want to include in the PDF
    const columns = [
        { header: 'Feedback', dataKey: 'feedback' },
        { header: 'Rating', dataKey: 'rating' }
    ];

    // Map the table data to the structure expected by jsPDF autoTable
    const rows = feedbacks.map(feedback => ({
        feedback: feedback.feedback,
        rating: feedback.rating
    }));

    doc.autoTable({
        startY: 30,  // Adjust the starting position of the table
        head: [columns.map(col => col.header)],
        body: rows.map(row => columns.map(col => row[col.dataKey]))
    });

    doc.save('feedback.pdf');
  };

  return (
    <div>
      <h2 className="text-center">Bala Cinema Feedback</h2>
      <div className="feedback-form">
        {/* Your existing feedback form code */}
      </div>
      {feedbacks.length > 0 ? (
        <div className="feedback-list text-center">
          <table id="feedback-table" className="table table-striped">
            <thead>
              <tr>
                <th>Feedback</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.map((feedback) => (
                <tr key={feedback._id}>
                  <td>{feedback.feedback}</td>
                  <td>{feedback.rating}</td>
                  <td>
                    <Button variant="info" className="btn btn-info btn-sm" onClick={() => handleEdit(feedback)}>
                      <FontAwesomeIcon icon={faEdit} /> Edit
                    </Button>
                    <Button variant="danger" className="btn btn-danger btn-sm" onClick={() => handleDelete(feedback._id)}>
                      Delete
                    </Button>
                    <Button variant="success" className="btn btn-success btn-sm" onClick={() => handleApprove(feedback._id)}>
                      Approve
                    </Button>
                    <Button variant="danger" className="btn btn-danger btn-sm" onClick={() => { handleReject(feedback._id); handleSendEmail(User.email, User.name, 'package'); }}>
                      Reject
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Button variant="primary" className="btn btn-primary" onClick={handlePrintPDF}>
            Print PDF
          </Button>
        </div>
      ) : (
        <p>No feedback available.</p>
      )}

      {/* Modal for editing feedback */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Feedback</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="feedbackForm">
              <Form.Label>Feedback</Form.Label>
              <Form.Control
                type="text"
                value={selectedFeedback?.feedback || ''}
                onChange={(e) => setSelectedFeedback({ ...selectedFeedback, feedback: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="ratingForm">
              <Form.Label>Rating</Form.Label>
              <Form.Control
                type="number"
                value={selectedFeedback?.rating || ''}
                onChange={(e) => setSelectedFeedback({ ...selectedFeedback, rating: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FeedbackList;
