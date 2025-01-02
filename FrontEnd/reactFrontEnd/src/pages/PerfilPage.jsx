import { useState, useEffect } from "react";
import {
    Button,
    Form,
    Container,
    Row,
    Col,
    Card,
    Navbar,
    Nav,
} from "react-bootstrap";
import { BsArrowLeft } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { verifyToken, updateUser, clearAuthToken } from '../services/api'; 
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { set } from "date-fns";

export default function PerfilPage() {
    const [userData, setUserData] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ ...userData });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    // Cargar los datos del usuario cuando el componente se monta
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await verifyToken(); // Llama a la función verifyToken
                setUserData(data); // Cargar los datos en el estado
                setFormData(data); // Cargar los datos en el formulario
            } catch (error) {
                console.error("Error al obtener los datos del usuario:", error);
                navigate("/login"); // Redirigir al login si hay error
            }
        };

        fetchUserData();
    }, []); // Se ejecuta una sola vez cuando el componente se monta


    const handleLogout = async () => {
        try {
          clearAuthToken();
        } catch (error) {
          console.error("Error al hacer logout:", error);
        }
    };
    
    // Manejar el cambio de valores en el formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Guardar los cambios en los datos del usuario
    const handleSaveChanges = async () => {
        try {
            const updatedUser = await updateUser(formData);
            alert('Usuario actualizado con éxito');
            setUserData(updatedUser);
            handleLogout();
            setIsEditing(false); // Actualizar datos en el formulario
            navigate('/login');
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            alert('Error al actualizar el usuario');
        }

    };

    // Cancelar la edición y restaurar los datos originales
    const handleCancelEdit = () => {
        setFormData(userData); // Restaurar los datos originales
        setIsEditing(false); // Desactivar el modo de edición
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev); // Cambiar el estado de la visibilidad de la contraseña
    };
    return (
        <>
            <Navbar bg="primary" variant="dark" expand="lg" className="fixed-top">
                <Container>
                    <Navbar.Brand className="fs-3">Tus datos</Navbar.Brand>
                    <Nav className="ms-auto">
                        <Link
                            to="/home"
                            className="btn btn-outline-light d-flex align-items-center"
                        >
                            <BsArrowLeft className="me-2" />
                            Volver
                        </Link>
                    </Nav>
                </Container>
            </Navbar>
            <Container className="mt-6" style={{ marginTop: "100px" }}>
                <Row>
                    <Col md={6} className="mx-auto">
                        <Card>
                            <Card.Body>
                                <Card.Title className="text-center mb-4">
                                    Perfil de Usuario
                                </Card.Title>
                                <Form>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="username"
                                            value={isEditing ? formData.username : userData.username}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            value={isEditing ? formData.email : userData.email}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3 position-relative">
                                        <Form.Label>Contraseña</Form.Label>
                                        <Form.Control
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={isEditing ? formData.password : userData.password}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                        />
                                        <div
                                            className="position-absolute pt-3"
                                            style={{ right: '10px', top: '30px', cursor: 'pointer' }}
                                            onClick={togglePasswordVisibility} // Llamar a la función para alternar la visibilidad
                                        >
                                            {showPassword ?  <FaEye /> : <FaEyeSlash />} {/* Mostrar el ícono según el estado */}
                                        </div>
                                    </Form.Group>

                                    <div className="d-flex justify-content-between">
                                        {isEditing ? (
                                            <>
                                                <Button variant="secondary" onClick={handleCancelEdit}>
                                                    Cancelar
                                                </Button>
                                                <Button variant="primary" onClick={handleSaveChanges}>
                                                    Guardar Cambios
                                                </Button>
                                            </>
                                        ) : (
                                            <Button
                                                variant="outline-primary"
                                                onClick={() => setIsEditing(true)}
                                            >
                                                Editar
                                            </Button>
                                        )}
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}
