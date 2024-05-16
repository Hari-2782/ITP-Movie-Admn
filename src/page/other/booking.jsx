import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const BookingList = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await fetch("http://localhost:8000/booking/getall");
            if (response.ok) {
                const data = await response.json();
                setBookings(data.data);
            } else {
                throw new Error('Failed to fetch bookings');
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };

    const handlePrintPDF = () => {
        const doc = new jsPDF();
        doc.autoTable({ html: '#booking-table' });
        doc.save('bookings.pdf');
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:8000/booking/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setBookings(bookings.filter(booking => booking._id !== id));
            } else {
                throw new Error('Failed to delete booking');
            }
        } catch (error) {
            console.error('Error deleting booking:', error);
        }
    };

    return (
        <div>
            <h1>Booking List</h1>
            <Button variant="secondary" onClick={handlePrintPDF}>Print PDF</Button>
            <Table striped bordered hover responsive id="booking-table">
                <thead>
                    <tr>
                        <th>Show Time</th>
                        <th>Show Date</th>
                        <th>Movie ID</th>
                        <th>Total Price</th>
                        <th>User ID</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map(booking => (
                        <tr key={booking._id}>
                            <td>{booking.showTime}</td>
                            <td>{booking.showDate}</td>
                            <td>{booking.movieId}</td>
                            <td>{booking.totalPrice}</td>
                            <td>{booking.userId}</td>
                            <td>
                                <Button variant="danger" onClick={() => handleDelete(booking._id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default BookingList;
