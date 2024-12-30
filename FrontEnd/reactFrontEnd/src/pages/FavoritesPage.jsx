import React, { useState, useEffect } from 'react';
import { Button, Card, Container, Row, Col, Navbar, Nav } from 'react-bootstrap';
import { BsArrowLeft } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import "../styles/FavoritesPage.css";

// Simulación de datos de noticias
const allNews = Array(50)
  .fill(null)
  .map((_, i) => ({
    id: i + 1,
    title: `Noticia ${i + 1}`,
    description: `Esta es la descripción de la noticia ${i + 1}. Contiene información relevante sobre el tema.`,
    category: ['Política', 'Economía', 'Tecnología', 'Deportes', 'Cultura'][Math.floor(Math.random() * 5)],
    date: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
    language: ['Español', 'Inglés', 'Francés'][Math.floor(Math.random() * 3)],
  }));

// Simula la obtención de categorías favoritas
const getFavoriteCategories = () => {
  return ['Tecnología', 'Deportes', 'Cultura'];
};

export default function FavoritesPage() {
  const [favoriteCategories, setFavoriteCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryNews, setCategoryNews] = useState([]);
  const [newsOffset, setNewsOffset] = useState(5); // Controla cuántas noticias mostrar inicialmente

  useEffect(() => {
    const categories = getFavoriteCategories();
    setFavoriteCategories(categories);
  }, []);

  const handleShowNews = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
      setCategoryNews([]);
      setNewsOffset(5); // Reinicia el offset
    } else {
      setSelectedCategory(category);
      const filteredNews = allNews.filter((news) => news.category === category).slice(0, 5);
      setCategoryNews(filteredNews);
      setNewsOffset(5);
    }
  };

  const handleLoadMoreNews = () => {
    const moreNews = allNews
      .filter((news) => news.category === selectedCategory)
      .slice(0, newsOffset + 5); // Incrementa el rango de noticias
    setCategoryNews(moreNews);
    setNewsOffset(newsOffset + 5);
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

      {/* Contenido principal */}
      <Container className="mt-5 pt-5">
        {/* Lista de Categorías en una sola columna */}
        <Row className="g-4">
          {favoriteCategories.map((category) => (
            <Col md={12} key={category}> {/* Solo una columna por categoría */}
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

              {/* Noticias de la categoría seleccionada */}
              {selectedCategory === category && (
                <div id={`news-${category}`} className="mt-3">
                  {/* Contenedor para noticias horizontales */}
                  <div className="d-flex overflow-auto">
                    {categoryNews.map((news) => (
                      <Card key={news.id} className="me-3" style={{ minWidth: '300px', maxWidth: '300px' }}>
                        <Card.Body>
                          <Card.Title>{news.title}</Card.Title>
                          <Card.Subtitle className="mb-2 text-muted">
                            {format(new Date(news.date), 'PP')} - {news.language}
                          </Card.Subtitle>
                          <Card.Text>{news.description}</Card.Text>
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

        {/* Mensaje si no hay categorías */}
        {favoriteCategories.length === 0 && (
          <p className="text-center text-muted mt-4">
            No tienes categorías favoritas guardadas.
          </p>
        )}
      </Container>
    </>
  );
}
