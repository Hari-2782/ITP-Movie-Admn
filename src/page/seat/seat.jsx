import React, { useEffect, useState } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const ScreenCrud = ({ theme }) => {
  const [screens, setScreens] = useState([]);
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    type: "",
    numRows: 0,
    numSeatsPerRow: 0,
    price: 0,
    screenType: ""
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const fetchScreens = async () => {
    try {
        const response = await fetch('http://localhost:8000/screen/getall');
        const data = await response.json();
        if (data.ok) {
            const screensArray = Object.values(data.screens); // Convert object to array
            setScreens(screensArray);
        }
    } catch (error) {
      toast.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchScreens();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    const { name, type, numRows, numSeatsPerRow, price, screenType } = formData;

    if (!name || !type || !numRows || !numSeatsPerRow || !price || !screenType) {
        toast.error('Please fill in all fields.');
        return;
    }
    if (formData._id) {
      await fetch(`http://localhost:8000/screen/update/${formData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      toast.success('Screen update successfully');
    } else {

      await fetch("http://localhost:8000/screen/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData),
      });
      toast.success('Screen created successfully');
    }
    fetchScreens();
    handleClose();
  };

  const handleEdit = (screen) => {
    setFormData(screen);
    handleShow();
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:8000/screen/delete/${id}`, {
      method: "DELETE"
    });
    toast.success('Screen delete successfully');
    fetchScreens();
  };

  return (
    <div className={`container${theme}`}>
      <ToastContainer />
         <h1>Screen Management</h1>
      <Button variant="primary" onClick={() => {setFormData({}); handleShow();}}>
        Add New Screen
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{formData._id ? "Edit Screen" : "Add New Screen"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="type">
              <Form.Label>Type</Form.Label>
                <Form.Control
                type="text"
                placeholder="Enter type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                
              /> 
              
            </Form.Group>
            <Form.Group controlId="numRows">
              <Form.Label>Number of Rows</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter number of rows"
                name="numRows"
                value={formData.numRows}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="numSeatsPerRow">
              <Form.Label>Number of Seats Per Row</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter number of seats per row"
                name="numSeatsPerRow"
                value={formData.numSeatsPerRow}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="screenType">
              <Form.Label>Screen Type</Form.Label>
               <Form.Control
                as="select"
                name="screenType"
                value={formData.screenType}
                onChange={handleInputChange}
              >
                <option value="IMAX">IMAX</option>
                <option value="3D">3D</option>
                <option value="2D">2D</option>
              </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit">
              Save
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <hr />
      <h1>Screen List</h1>
     
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>ScreenType</th>
            {/* <th>Price</th> */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {screens.map((screen) => (
            <tr key={screen._id}>
              <td>{screen.name}</td>
              <td>{screen.screenType}</td>
              {/* <td>{screen.price}</td> */}
              <td>
                <Button variant="info" onClick={() => handleEdit(screen)}>Edit</Button>{" "}
                <Button variant="danger" onClick={() => handleDelete(screen._id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      
      </div>
    
  );
};

export default ScreenCrud;
