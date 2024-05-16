import React, { useEffect, useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddFoodItem = () => {
    const [items, setItems] = useState([]);
    const [foodItem, setFoodItem] = useState({
        type: '',
        name: '',
        imageurl: '',
        quantity: 0,
        price: 0,
        description: ''
    });
    

    useEffect(() => {
        fetchItems();
    }, []);

      const fetchItems = async () => {
    try {
      const response = await fetch('http://localhost:8000/food/getall');
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      } else {
        throw new Error('Failed to fetch food items');
      }
    } catch (error) {
      console.error('Error fetching food items:', error);
      toast.error('Failed to fetch food items'); // Add error message
    }
  };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = foodItem._id ? `http://localhost:8000/food/update/${foodItem._id}` : 'http://localhost:8000/food/create';
            const method = foodItem._id ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(foodItem),
            });
            if (response.ok) {
                const data = await response.json();
                if (method === 'PUT') {
                    setItems(items.map(item => (item._id === data._id ? data : item)));
                    toast.success('Food item updated successfully');
                } else {
                    setItems([...items, data]);
                    toast.success('Food item added successfully');
                }
            } else {
                throw new Error('Failed to add/update food item');
            }
        } catch (error) {
            console.error('Error adding/updating food item:', error);
            toast.error('Failed to add/update food item');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFoodItem({ ...foodItem, [name]: value });
    };

    const handleEdit = (id) => {
        const editedItem = items.find(item => item._id === id);
        if (editedItem) {
            setFoodItem(editedItem);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:8000/food/delete/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setItems(items.filter(item => item._id !== id));
                toast.success('Food item deleted successfully');
            } else {
                throw new Error('Failed to delete food item');
            }
        } catch (error) {
            console.error('Error deleting food item:', error);
            toast.error('Failed to delete food item');
        }
    };

    return (
        <Container>
            <h1>Add Food Item</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="type">
                    <Form.Label>Type</Form.Label>
                    <Form.Control type="text" name="type" value={foodItem.type} onChange={handleInputChange} />
                </Form.Group>
                <Form.Group controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" name="name" value={foodItem.name} onChange={handleInputChange} />
                </Form.Group>
                <Form.Group controlId="imageurl">
                    <Form.Label>Image URL</Form.Label>
                    <Form.Control type="text" name="imageurl" value={foodItem.imageurl} onChange={handleInputChange} />
                </Form.Group>
                <Form.Group controlId="quantity">
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control type="number" name="quantity" value={foodItem.quantity} onChange={handleInputChange} />
                </Form.Group>
                <Form.Group controlId="price">
                    <Form.Label>Price</Form.Label>
                    <Form.Control type="number" name="price" value={foodItem.price} onChange={handleInputChange} />
                </Form.Group>
                <Form.Group controlId="description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control type="text" name="description" value={foodItem.description} onChange={handleInputChange} />
                </Form.Group>
                <Button variant="primary" type="submit">Add Food Item</Button>
            </Form>
            <hr />
            <h2>Food Items</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(item => (
                        <tr key={item._id}>
                            <td>{item.name}</td>
                            <td>{item.type}</td>
                            <td>{item.quantity}</td>
                            <td>{item.price}</td>
                            <td>{item.description}</td>
                            <td>
                                <Button onClick={()=>handleDelete(item._id)}>Edit</Button>
                                <Button onClick={()=>handleDelete(item._id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ToastContainer position="top-right" />
        </Container>
    );
};

export default AddFoodItem;
