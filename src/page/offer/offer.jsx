import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Container, Table } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const PackageManagement = () => {
    const [packages, setPackages] = useState([]);
    const [formData, setFormData] = useState({
        image: '',
        name: '',
        discount: 0,
        description: '',
        price: 0,
        type: '',
        expiresAt: ''
    });
    const [selectedPackage, setSelectedPackage] = useState(null);
    const tableRef = useRef(null);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPackages();
    }, []);

    const validateDate = (date) => {
        const selectedDate = new Date(date);
        const now = new Date();
        const futureDate = new Date();
        futureDate.setFullYear(now.getFullYear() + 1); // 1 year from now

        return selectedDate >= now && selectedDate <= futureDate;
    };

    const fetchPackages = async () => {
        fetch(`http://localhost:8000/offer/getall`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.ok) {
                    setPackages(data.data);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let url = 'http://localhost:8000/offer/pack';
            let method = 'POST';
            if (selectedPackage) {
                url += `/${selectedPackage._id}`;
                method = 'PUT';
            }

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                if (selectedPackage) {
                    setPackages(packages.map(p => p._id === data._id ? data : p));
                    toast.success('Package updated successfully');
                } else {
                    setPackages([...packages, data]);
                    toast.success('Package added successfully');
                }
                setFormData({
                    image: '',
                    name: '',
                    discount: 0,
                    description: '',
                    price: 0,
                    type: '',
                    expiresAt: ''
                });
                setSelectedPackage(null);
            } else {
                throw new Error('Failed to add/update package');
            }
        } catch (error) {
            console.error('Error adding/updating package:', error);
            toast.error('Failed to add/update package');
        }
    };

    const handleEdit = (pkg) => {
        setSelectedPackage(pkg);
        setFormData({
            image: pkg.image,
            name: pkg.name,
            discount: pkg.discount,
            description: pkg.description,
            price: pkg.price,
            type: pkg.type,
            expiresAt: pkg.expiresAt
        });
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:8000/offer/delete/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setPackages(packages.filter(pkg => pkg._id !== id));
                toast.success('Package deleted successfully');
            } else {
                throw new Error('Failed to delete package');
            }
        } catch (error) {
            console.error('Error deleting package:', error);
            toast.error('Failed to delete package');
        }
    };

    const handlePrintPDF = () => {
        const doc = new jsPDF();
        
        // Set font size and style for the title
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        
        // Add the title and center it
        doc.text("Bala Cinema Offer", doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
    
        // Define the columns you want to include in the PDF
        const columns = [
            { header: 'Name', dataKey: 'name' },
            { header: 'Type', dataKey: 'type' },
            { header: 'Price', dataKey: 'price' }
        ];
    
        // Map the table data to the structure expected by jsPDF autoTable
        const rows = packages.map(pkg => ({
            name: pkg.name,
            type: pkg.type,
            price: pkg.price
        }));
    
        doc.autoTable({
            startY: 30,  // Adjust the starting position of the table
            head: [columns.map(col => col.header)],
            body: rows.map(row => columns.map(col => row[col.dataKey]))
        });
    
        doc.save('Package.pdf');
    };

    const handleImageChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handleImageUpload = async () => {
        try {
            const formDataObj = new FormData();
            formDataObj.append('myimage', formData.image);
    
            const response = await fetch('http://localhost:8000/image/uploadimage', {
                method: 'POST',
                body: formDataObj,
            });
    
            if (response.ok) {
                const data = await response.json();
                const imageUrl = data.imageUrl; // Assuming the response contains the image URL
                setFormData({ ...formData, image: imageUrl });
                toast.success('Image uploaded successfully');
            } else {
                throw new Error('Failed to upload image');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Failed to upload image');
        }
    };

    const handleDateChange = (e) => {
        const date = e.target.value;
        if (validateDate(date)) {
            setFormData({ ...formData, expiresAt: date });
            setError('');
        } else {
            setError('Please select a date between now and one year from today.');
        }
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <Container>
            <h1>Package Management</h1>
            <Button variant="secondary" onClick={handlePrintPDF}>Print PDF</Button>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="image">
                    <Form.Label>Image</Form.Label>
                    <Form.Control type="file" name="image" onChange={handleImageChange} />
                    <Button onClick={handleImageUpload}>Upload Image</Button>
                </Form.Group>
                <Form.Group controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </Form.Group>
                <Form.Group controlId="discount">
                    <Form.Label>Discount</Form.Label>
                    <Form.Control type="number" name="discount" value={formData.discount} onChange={(e) => setFormData({ ...formData, discount: e.target.value })} />
                </Form.Group>
                <Form.Group controlId="description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control type="text" name="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                </Form.Group>
                <Form.Group controlId="price">
                    <Form.Label>Price</Form.Label>
                    <Form.Control type="number" name="price" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                </Form.Group>
                <Form.Group controlId="type">
                    <Form.Label>Type</Form.Label>
                    <Form.Control as="select" name="type" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                        <option value="offer">Offer</option>
                        <option value="package">Package</option>
                        <option value="premium">Premium Package</option>
                        <option value="other">Other</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="expiresAt">
                    <Form.Label>Expiration Date</Form.Label>
                    <Form.Control type="date" name="expiresAt" min={today} value={formData.expiresAt} onChange={handleDateChange} />
                    {error && <Form.Text className="text-danger">{error}</Form.Text>}
                </Form.Group>
                <Button variant="primary" type="submit">{selectedPackage ? 'Update' : 'Add'} Package</Button>
            </Form>
            <hr />
            <h2>Packages</h2>
            <Table striped bordered hover responsive ref={tableRef} id="package-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Discount</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Type</th>
                        <th>Expires At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {packages.map(pkg => (
                        <tr key={pkg._id}>
                            <td>{pkg.name}</td>
                            <td>{pkg.discount}</td>
                            <td>{pkg.description}</td>
                            <td>{pkg.price}</td>
                            <td>{pkg.type}</td>
                            <td>{pkg.expiresAt}</td>
                            <td>
                                <Button variant="warning" onClick={() => handleEdit(pkg)}>Edit</Button>
                                <Button variant="danger" onClick={() => handleDelete(pkg._id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <ToastContainer />
        </Container>
    );
};

export default PackageManagement;
