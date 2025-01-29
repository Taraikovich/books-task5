import React from 'react';
import { Book } from '../lib/actions';
import { Button, Col, Container, Row } from 'react-bootstrap';

const BookDescription = ({ book }: { book: Book }) => {
  return (
    <Container>
      <Row>
        <Col>
          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              textAlign: 'center',
              backgroundImage: `url(${book.cover})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              width: '300px',
              height: '450px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
              alignItems: 'center',
              color: '#fff',
              textShadow: '1px 1px 3px rgba(0,0,0,0.5)',
            }}
          >
            <p>{book.author}</p>
            <p>{book.title}</p>
          </div>
          <Button variant="primary">
            <i className="bi bi-hand-thumbs-up-fill"> {book.likes}</i>
          </Button>
        </Col>
        <Col>
          <h2>
            <strong>{book.title}</strong>
          </h2>
          <h4>
            <strong>
              by <i>{book.author}</i>
            </strong>
          </h4>
          <p style={{ color: 'gray' }}>{book.publisher}</p>
          <p>
            <b>Rewiews</b>
          </p>
          {book.reviews.map((review, i) => (
            <div key={i}>
              <p> {review.review}</p>
              <p style={{ color: 'gray' }}>
                - {review.reviewer}, {review.company}
              </p>
            </div>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default BookDescription;
