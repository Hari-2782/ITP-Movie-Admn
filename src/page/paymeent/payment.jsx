import React, { useState, useEffect } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';

const Payments = () => {
    const [payments, setPayments] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [paymentToDelete, setPaymentToDelete] = useState(null);

    useEffect(() => {
        getAllPayments();
    }, []);

    const getAllPayments = async () => {
        try {
            const response = await fetch('http://localhost:8000/payment/payments');
            const data = await response.json();
            setPayments(data.payments);
        } catch (error) {
            console.error('Error fetching payments:', error);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:8000/payment/payment/${paymentToDelete}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setPayments(payments.filter((payment) => payment._id !== paymentToDelete));
            }
        } catch (error) {
            console.error('Error deleting payment:', error);
        }
        setPaymentToDelete(null);
        setShowDeleteModal(false);
    };

    const openDeleteModal = (paymentId) => {
        setPaymentToDelete(paymentId);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setPaymentToDelete(null);
        setShowDeleteModal(false);
    };

    return (
        <div>
            <h1>Payments Report</h1>
            <hr />
            <Table striped bordered hover responsive="xl" >
                <thead>
                    <tr>
                        <th>Payment ID</th>
                        <th>Amount</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.map((payment) => (
                        <tr key={payment._id}>
                            <td>{payment._id}</td>
                            <td>{payment.Totalamount}</td>
                            <td>
                                <Button variant="danger" onClick={() => openDeleteModal(payment._id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showDeleteModal} onHide={closeDeleteModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Payment</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this payment?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeDeleteModal}>Cancel</Button>
                    <Button variant="danger" onClick={handleDelete}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Payments;
