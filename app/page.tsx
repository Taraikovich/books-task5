'use client';

import { createBooks, Book } from './lib/actions';
import React, { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import {
  Table,
  Form,
  FloatingLabel,
  Row,
  Col,
  Container,
  Button,
  Spinner,
} from 'react-bootstrap';
import BookDescription from './ui/BookDescription';

export default function Home() {
  const [books, setBooks] = useState<Book[] | []>([]);
  const [showDescription, setShowDescription] = useState<number | undefined>();
  const [loading, setLoading] = useState(false);
  const [language, setLaguage] = useState<'fr' | 'en' | 'ru'>('en');
  const [seed, setSeed] = useState(123456);
  const [seedShift, setSeedShift] = useState(0);
  const [likes, setLikes] = useState(10);
  const [reviews, setReviews] = useState(3);

  const [value] = useDebounce(seed, 1000);
  const currentSeed = value + seedShift;

  console.log(currentSeed);

  useEffect(() => {
    async function fetchBooks(booksCount = 10) {
      const data = await createBooks(
        currentSeed,
        language,
        likes,
        reviews,
        booksCount
      );
      setBooks((prevData) => [...prevData, ...data]);
    }

    if (books.length < 20) {
      fetchBooks(20);
    } else {
      fetchBooks();
    }
    setLoading(false);
  }, [currentSeed, likes, reviews, language]);

  const handleScroll = () => {
    if (
      document.body.scrollHeight - 300 <
      window.scrollY + window.innerHeight
    ) {
      setLoading(true);
    }
  };

  function debounce(func: (...args: unknown[]) => void, delay: number) {
    let timeoutId: NodeJS.Timeout;
    return function (...args: unknown[]) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  }

  useEffect(() => {
    const handler = debounce(handleScroll, 500);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    if (loading === true) {
      setSeedShift((prevSeedShift) => prevSeedShift + 10);
    }
  }, [loading]);

  return (
    <>
      <Form
        style={{
          position: 'sticky',
          top: '0',
          backgroundColor: 'white',
          padding: '10px',
          borderBottom: '1px solid black',
        }}
      >
        <Container fluid="md">
          <Row>
            <Col>
              <FloatingLabel
                controlId="languageSelect"
                label="Select Language"
                className="mb-3"
              >
                <Form.Select
                  aria-label="Select language"
                  defaultValue={language}
                  onChange={(e) => {
                    setBooks([]);
                    setSeedShift(0);
                    setLaguage(e.target.value as 'fr' | 'en' | 'ru');
                  }}
                >
                  <option value="en">English (EN)</option>
                  <option value="ru">Russian (RU)</option>
                  <option value="fr">French (FR)</option>
                </Form.Select>
              </FloatingLabel>
            </Col>
            <Col>
              <FloatingLabel
                controlId="inputSeed"
                label="Seed"
                className="mb-3"
              >
                <Form.Control
                  type="number"
                  value={seed}
                  onChange={(e) => {
                    setBooks([]);
                    setSeedShift(0);
                    setSeed(Number(e.target.value));
                  }}
                />
                <Button
                  variant="dark"
                  style={{ position: 'absolute', top: '17%', left: '82%' }}
                  onClick={() => {
                    setBooks([]);
                    setSeedShift(0);
                    setSeed(Math.floor(Math.random() * 100000));
                  }}
                >
                  <i className="bi bi-shuffle"></i>
                </Button>
              </FloatingLabel>
            </Col>
            <Col>
              <Form.Label htmlFor="inputLikes">Likes {likes}</Form.Label>
              <Form.Range
                id="inputLikes"
                min={0}
                max={10}
                step={0.1}
                value={likes}
                onChange={(e) => {
                  setBooks([]);
                  setSeedShift(0);
                  setLikes(Number(e.target.value));
                }}
              />
            </Col>
            <Col>
              <FloatingLabel
                controlId="inputReview"
                label="Review"
                className="mb-3"
              >
                <Form.Control
                  type="number"
                  value={reviews}
                  step={0.1}
                  onChange={(e) => {
                    setBooks([]);
                    setSeedShift(0);
                    setReviews(Number(e.target.value));
                  }}
                />
              </FloatingLabel>
            </Col>
          </Row>
        </Container>
      </Form>
      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>ISBN</th>
            <th>Title</th>
            <th>Author</th>
            <th>Publisher</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book, index) => (
            <React.Fragment key={index}>
              <tr
                onClick={() =>
                  setShowDescription(
                    index === showDescription ? undefined : index
                  )
                }
              >
                <td>{index + 1}</td>
                <td>{book.ISBN}</td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.publisher}</td>
              </tr>
              {index === showDescription && (
                <tr>
                  <td colSpan={5}>
                    <BookDescription book={book} />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
          <tr>
            <td colSpan={5} style={{ textAlign: 'center' }}>
              <Button variant="dark" disabled>
                <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                Loading...
              </Button>
            </td>
          </tr>
        </tbody>
      </Table>
    </>
  );
}
