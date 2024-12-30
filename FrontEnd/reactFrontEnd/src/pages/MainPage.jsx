import { useState, useEffect } from 'react';
import { Button, Form, InputGroup, Dropdown, DropdownButton, Card, Row, Col, Container, Navbar, Nav, Accordion } from 'react-bootstrap';
import { CalendarIcon, StarIcon, LogOutIcon } from 'lucide-react';
import { format } from "date-fns";
import { Link } from "react-router-dom";
import "../styles/MainPage.css";

// Datos de ejemplo para las noticias
const allNews = Array(50).fill(null).map((_, i) => ({
  id: i + 1,
  title: `Noticia ${i + 1}`,
  description: `Esta es la descripción de la noticia ${i + 1}. Contiene información relevante sobre el tema.`,
  category: ['Política', 'Economía', 'Tecnología', 'Deportes', 'Cultura'][Math.floor(Math.random() * 5)],
  date: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
  language: ['Español', 'Inglés', 'Francés'][Math.floor(Math.random() * 3)],
}));

export default function MainPage() {
  const [category, setCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [language, setLanguage] = useState('all');
  const [news, setNews] = useState(allNews.slice(0, 10));
  const [page, setPage] = useState(1);

  const filterNews = () => {
    let filtered = allNews;

    if (category) {
      filtered = filtered.filter(item =>
        item.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    if (startDate && endDate) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return itemDate >= start && itemDate <= end;
      });
    }

    if (language && language !== 'all') {
      filtered = filtered.filter(item => item.language === language);
    }

    setNews(filtered.slice(0, 10));
    setPage(1);
  };

  const loadMore = () => {
    const nextPage = page + 1;
    const newNews = allNews.slice(0, nextPage * 10);
    setNews(newNews);
    setPage(nextPage);
  };

  useEffect(() => {
    filterNews();
  }, [category, startDate, endDate, language]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar con fondo azul y fijo en la parte superior */}
      <Navbar bg="primary" variant="dark" expand="lg" className="fixed-top">
        <Container>
          <Navbar.Brand href="#home" className="fs-3">Noticias</Navbar.Brand>
          <Nav className="ms-auto">
            <Link to="/favorites">
                <Button variant="outline-light" className="d-flex align-items-center">
                <StarIcon className="mr-2" />
                Favoritas
                </Button>
            </Link>
            <Link to="/">
                <Button variant="outline-light" className="d-flex align-items-center ms-2">
                <LogOutIcon className="mr-2" />
                    Logout
                </Button>
            </Link>
          </Nav>
        </Container>
      </Navbar>

      {/* Contenedor de contenido con espacio para el navbar fijo */}
      <Container className="mx-auto p-4" style={{ marginTop: '80px', flexGrow: 1, overflowY: 'auto' }}>
        {/* Filtro en acordeón */}
        <Accordion className="mb-5">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Filtros</Accordion.Header>
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

                <Form.Group className="mb-3">
                  <Form.Label>Rango de fechas</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                    <span className="mx-2"></span>
                    <Form.Control
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Idioma</Form.Label>
                  <DropdownButton
                    id="language-dropdown"
                    title={language === 'all' ? 'Todos' : language}
                    onSelect={setLanguage}
                    variant="outline-secondary"
                    className="w-100"
                  >
                    <Dropdown.Item eventKey="all">Todos</Dropdown.Item>
                    <Dropdown.Item eventKey="Español">Español</Dropdown.Item>
                    <Dropdown.Item eventKey="Inglés">Inglés</Dropdown.Item>
                    <Dropdown.Item eventKey="Francés">Francés</Dropdown.Item>
                  </DropdownButton>
                </Form.Group>

                <Button variant="primary" onClick={filterNews} className="w-100">
                  Filtrar
                </Button>
              </Form>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        {/* Noticias */}
        <Row className="row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {news.map((item) => (
            <Col key={item.id}>
              <Card className="h-100">
                <Card.Header>
                  <Card.Title>{item.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {format(new Date(item.date), "PP")} - {item.category} - {item.language}
                  </Card.Subtitle>
                </Card.Header>
                <Card.Body>
                  <p>{item.description}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {news.length < allNews.length && (
          <div className="mt-4 text-center">
            <Button onClick={loadMore} variant="primary">Cargar más</Button>
          </div>
        )}
      </Container>
    </div>
  );
}
