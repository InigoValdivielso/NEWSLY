import { useState, useEffect } from 'react';
import { Button, Form, InputGroup, Dropdown, DropdownButton, Card, Row, Col, Container, Navbar, Nav, Accordion } from 'react-bootstrap';
import { CalendarIcon, StarIcon, LogOutIcon } from 'lucide-react';
import { format } from "date-fns";
import { Link } from "react-router-dom";
import "../styles/HomePage.css";
import { getNoticias, getNoticiasFiltradas, clearAuthToken } from '../services/api.jsx';

export default function MainPage() {
  const [category, setCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [language, setLanguage] = useState('all');
  const [news, setNews] = useState([]); // Noticias cargadas desde la base de datos
  const [page, setPage] = useState(1); // Estado para la página actual
  const [isFiltered, setIsFiltered] = useState(false); // Para saber si se están mostrando noticias filtradas
  const [visibleNewsCount, setVisibleNewsCount] = useState(10); // Número de noticias visibles inicialmente

  const handleLogout = async () => {
    try {
      clearAuthToken();
    } catch (error) {
      console.error('Error al hacer logout:', error);
    }
  };

  // Función para cargar noticias sin filtro con paginación
  const fetchNoticias = async () => {
    try {
      const response = await getNoticias(page); // Asumiendo que la API puede manejar la paginación
      console.log('Respuesta de noticias:', response);
      if (response) {
        setNews((prevNews) => [...prevNews, ...response]); // Añadir las noticias cargadas a las previas
      } else {
        setNews([]); // Si no hay datos, aseguramos que sea un array vacío
      }
    } catch (error) {
      console.error('Error al obtener noticias:', error);
      setNews([]); // Asegurarse de que 'news' sea un array vacío en caso de error
    }
  };

  // Función para cargar noticias con filtro y paginación
  const fetchNoticiasFiltradas = async () => {
    try {
      const filters = {
        categoria: category,
        idioma: language === 'all' ? '' : language,
        fechaInicio: startDate,
        fechaFin: endDate
      };
      console.log('Filtros de noticias:', filters);

      const noticiasFiltradas = await getNoticiasFiltradas(filters, page); // Paginación aquí
      if (noticiasFiltradas) {
        setNews((prevNews) => [...prevNews, ...noticiasFiltradas]); // Añadir las noticias filtradas
      } else {
        setNews([]); // Si no hay datos, aseguramos que sea un array vacío
      }
    } catch (error) {
      console.error('Error al obtener noticias filtradas:', error);
      setNews([]); // Asegurarse de que 'news' sea un array vacío en caso de error
    }
  };

  // Filtrar noticias según los parámetros de filtro
  const filterNews = () => {
    setIsFiltered(true); // Indicar que ahora se están mostrando noticias filtradas
    setNews([]); // Limpiar las noticias previas antes de aplicar el filtro
    setVisibleNewsCount(10); // Reiniciar el número de noticias visibles al aplicar filtros
    setPage(1); // Reiniciar la página al aplicar filtros
    fetchNoticiasFiltradas(); // Llamar a la función para obtener noticias filtradas
  };

  // Cargar más noticias si hay más para mostrar
  const loadMore = () => {
    setVisibleNewsCount(visibleNewsCount + 10); // Aumentar la cantidad de noticias visibles
    setPage(page + 1); // Aumentar la página actual
  };

  // Cargar noticias al principio (sin filtro)
  useEffect(() => {
    if (!isFiltered) {
      fetchNoticias(); // Obtener noticias cuando se carga la página por primera vez (sin filtro)
    }
  }, [isFiltered, page]); // Solo se vuelve a ejecutar cuando cambia 'isFiltered' o 'page'

  useEffect(() => {
    if (category || startDate || endDate || language !== 'all') {
      filterNews(); // Si hay algún filtro aplicado, hacer la llamada para obtener noticias filtradas
    } else {
      if (isFiltered) {
        setIsFiltered(false); // Volver a mostrar las noticias sin filtro
      }
    }
  }, [category, startDate, endDate, language]); // Dependencias para recargar las noticias al cambiar los filtros

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
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
            <Link to="/login">
              <Button variant="outline-light" className="d-flex align-items-center ms-2" onClick={handleLogout}>
                <LogOutIcon className="mr-2" />
                Logout
              </Button>
            </Link>
          </Nav>
        </Container>
      </Navbar>

      <Container className="mx-auto p-4" style={{ marginTop: '80px', flexGrow: 1, overflowY: 'auto' }}>
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
                    <Dropdown.Item eventKey="es">Español</Dropdown.Item>
                    <Dropdown.Item eventKey="en">Inglés</Dropdown.Item>
                    <Dropdown.Item eventKey="fr">Francés</Dropdown.Item>
                  </DropdownButton>
                </Form.Group>

                <Button variant="primary" onClick={filterNews} className="w-100">
                  Filtrar
                </Button>
              </Form>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <Row className="row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {news.length > 0 ? (
            news.slice(0, visibleNewsCount).map((item) => ( // Solo mostrar hasta 'visibleNewsCount' noticias
              <Col key={item._id}>
                <Card className="h-100">
                  <Card.Header>
                    <Card.Title>{item.titulo}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {format(new Date(item.fecha), "PP")} - {item.categoria} - {item.idioma}
                    </Card.Subtitle>
                  </Card.Header>
                  <Card.Body>
                    <p>{item.autor}</p>
                    <a href={item.url} target="_blank" rel="noopener noreferrer">Leer más</a>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col>
              <p>No se encontraron noticias.</p>
            </Col>
          )}
        </Row>

        {news.length > 0 && visibleNewsCount < news.length && (
          <div className="mt-4 text-center">
            <Button onClick={loadMore} variant="primary">Cargar más</Button>
          </div>
        )}
      </Container>
    </div>
  );
}
