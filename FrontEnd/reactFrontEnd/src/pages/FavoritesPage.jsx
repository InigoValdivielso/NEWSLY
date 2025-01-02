import React, { useState, useEffect } from 'react';
import { Button, Card, Container, Row, Col, Navbar, Nav, Accordion, Form} from 'react-bootstrap';
import { BsArrowLeft } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { getFavorites, getNoticiasFiltradas, addFavorite } from '../services/api.jsx'; // Importar la función addFavorite
import "../styles/FavoritesPage.css";


export default function FavoritesPage() {
  const [favoriteCategories, setFavoriteCategories] = useState([]); // Lista de categorías favoritas
  const [selectedCategory, setSelectedCategory] = useState(null); // Categoría seleccionada
  const [categoryNews, setCategoryNews] = useState([]); // Noticias de la categoría seleccionada
  const [newsOffset, setNewsOffset] = useState(5); // Número de noticias a cargar
  const [loading, setLoading] = useState(false); // Estado de carga
  const [visibleNewsCount, setVisibleNewsCount] = useState(10);

  const [category, setCategory] = useState(''); // Estado para la categoría que se va a añadir

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const favorites = await getFavorites();
        // Extraer las categorías únicas de las noticias favoritas
        const categories = [...new Set(favorites.map((news) => news.categoria))];
        setFavoriteCategories(categories);
      } catch (error) {
        console.error("Error al obtener las categorías favoritas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleShowNews = async (category) => {
    const filtros = {
      categoria: category, // Pasa la categoría seleccionada
      idioma: '',          // Valores vacíos por defecto
      fechaInicio: '',
      fechaFin: ''
    };
    if (selectedCategory === category) {
      // Ocultar noticias si ya están visibles
      setSelectedCategory(null);
      setCategoryNews([]); // Limpiar las noticias cuando se ocultan
    } else {
      // Mostrar noticias filtradas
      setSelectedCategory(category);
      setCategoryNews([]); // Limpiar las noticias anteriores
      await fetchCategoryNews(filtros);
    }
  };

  const fetchCategoryNews = async (filtros) => {
    try {
      const news = await getNoticiasFiltradas(filtros); // Llama a la función para obtener noticias filtradas
      setCategoryNews((prevNews) => [
        ...prevNews,
        ...news // Agregar noticias al estado
      ]);
    } catch (error) {
      console.error("Error al obtener noticias por categoría:", error);
    }
  };

  const handleLoadMoreNews = () => {
    setVisibleNewsCount(visibleNewsCount + 10); // Aumenta el número de noticias a mostrar
  };

  // Función para manejar el clic en "Añadir a Favoritos"
  const handleAddFavorite = async () => {
    try {
      const token = sessionStorage.getItem('token'); // Obtener el token desde sessionStorage

      if (!token) {
        alert('Token no encontrado');
        return;
      }

      const response = await addFavorite(category, token); // Llamar a la función addFavorite
      if (response.status === 'Favorite added successfully') {
        // Si la categoría se agrega correctamente, actualiza la lista de categorías favoritas
        setFavoriteCategories((prevCategories) => [...prevCategories, category]);
        setCategory(''); // Limpiar el campo de categoría
        alert(`Categoría "${category}" agregada a favoritos.`);
      } else {
        alert('Error al agregar la categoría a favoritos.');
      }
    } catch (error) {
      console.error('Error al agregar la categoría:', error);
      alert('Hubo un error al agregar la categoría a favoritos.');
    }
  };

  return (
    <>
      {/* Navbar */}
      <Navbar bg="primary" variant="dark" expand="lg" className="fixed-top">
        <Container>
          <Navbar.Brand href="#home" className="fs-3">Categorías Favoritas</Navbar.Brand>
          <Nav className="ms-auto">
            <Link to="/home" className="btn btn-outline-light d-flex align-items-center">
              <BsArrowLeft className="me-2" />
              Volver a Noticias
            </Link>
          </Nav>
        </Container>
      </Navbar>
      <Container className="mx-auto p-4" style={{ marginTop: '80px', flexGrow: 1, overflowY: 'auto' }}>
        <Accordion className="mb-5">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Añadir a Favoritos</Accordion.Header>
            <Accordion.Body>
              <Form>
                <Form.Group controlId="category" className="mb-3">
                  <Form.Label>Categoría</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Escribe una categoría"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </Form.Group>

                <Button variant="primary" className="w-100" onClick={handleAddFavorite}>
                  Añadir
                </Button>
              </Form>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Container>

      {/* Contenido principal */}
      <Container className="pt-5">
        {loading ? (
          <p className="text-center text-muted">Cargando...</p>
        ) : favoriteCategories.length > 0 ? (
          <Row className="g-4">
            {favoriteCategories.map((category) => (
              <Col md={12} key={category}>
                <Card>
                  <Card.Body>
                    <Card.Title>{category}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">Categoría favorita</Card.Subtitle>
                    <Card.Text>
                      Aquí puedes ver las últimas noticias de {category}.
                    </Card.Text>
                    <Button
                      variant="primary"
                      onClick={() => handleShowNews(category)}
                      aria-expanded={selectedCategory === category}
                      aria-controls={`news-${category}`}
                    >
                      {selectedCategory === category ? 'Ocultar' : 'Ver'} noticias de {category}
                    </Button>
                  </Card.Body>
                </Card>

                {selectedCategory === category && (
                  <div id={`news-${category}`} className="mt-3">
                    <div className="d-flex overflow-auto">
                      {categoryNews.slice(0, visibleNewsCount).map((news) => (
                        <Card key={news._id} className="me-3" style={{ minWidth: '300px', maxWidth: '300px' }}>
                          <Card.Body>
                            <Card.Title>{news.titulo}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">
                              {format(new Date(news.fecha), 'PP')} - {news.idioma}
                            </Card.Subtitle>
                            <Card.Text>{news.autor}</Card.Text>
                            <a href={news.url} target="_blank" rel="noopener noreferrer">Leer más</a>
                          </Card.Body>
                        </Card>
                      ))}
                    </div>

                    {/* Botón para cargar más noticias */}
                    <div className="text-center mt-3">
                      <Button variant="secondary" onClick={handleLoadMoreNews}>
                        Cargar más noticias
                      </Button>
                    </div>
                  </div>
                )}
              </Col>
            ))}
          </Row>
        ) : (
          <p className="text-center text-muted mt-4">No tienes categorías favoritas guardadas.</p>
        )}
      </Container>
    </>
  );
}
