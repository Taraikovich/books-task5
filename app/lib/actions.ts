'use server';

import { fakerFR, fakerRU, fakerEN } from '@faker-js/faker';
import seedrandom from 'seedrandom';

const setFaker = (lang: 'fr' | 'en' | 'ru' = 'en') => {
  const faker = {
    ru: fakerRU,
    en: fakerEN,
    fr: fakerFR,
  };

  return faker[lang];
};

type Review = {
  review: string;
  reviewer: string;
  company: string;
};

export type Book = {
  ISBN: string;
  title: string;
  author: string;
  publisher: string;
  cover: string;
  likes: number;
  reviews: Review[] | [];
};

function createBookData(
  faker: typeof fakerRU | typeof fakerEN | typeof fakerFR,
  seed: number
) {
  faker.seed(seed);
  return {
    ISBN: faker.commerce.isbn(),
    title: faker.lorem.sentence({ min: 1, max: 2 }),
    author: faker.person.fullName(),
    publisher: `${faker.company.name()}, ${new Date(
      faker.date.past({ years: 30 })
    ).getFullYear()}`,
    cover: faker.image.urlPicsumPhotos({ width: 300, height: 500 }),
  };
}

const createLikesArray = (seed: number, length: number, likesCount: number) => {
  const array = createRandomArray(length, likesCount);
  return shuffleArray(seed, array);
};

function createReviewData(
  faker: typeof fakerRU | typeof fakerEN | typeof fakerFR,
  seed: number,
  length: number,
  reviewCount: number
) {
  faker.seed(seed);
  const array = createRandomArray(length, reviewCount);

  return shuffleArray(seed, array).map((i) =>
    Array.from({ length: i }, () => ({
      review: faker.lorem.sentences({ min: 2, max: 3 }),
      reviewer: faker.person.fullName(),
      company: faker.company.name(),
    }))
  );
}

function shuffleArray(seed: number, array: number[]) {
  const rng = seedrandom(String(seed));

  const result = array
    .map((el) => ({ sort: rng(), value: el }))
    .sort((a, b) => a.sort - b.sort)
    .map((el) => el.value);

  return result;
}

function createRandomArray(length: number, value: number) {
  const fractionalPart = Math.floor((value % 1) * length);

  const array = Array.from({ length }, (_, index) => {
    return index < fractionalPart ? Math.ceil(value) : Math.floor(value);
  });

  return array;
}

export async function createBooks(
  seed: number,
  lang: 'fr' | 'en' | 'ru' = 'en',
  likesCount: number,
  reviewCount: number,
  page = 1,
  booksPerPage = 10
): Promise<Book[]> {
  const shift = seed + booksPerPage * page;
  const faker = setFaker(lang);

  const bookData = Array.from({ length: booksPerPage }, (_, i) =>
    createBookData(faker, shift + i)
  );

  const likesPerBook = createLikesArray(shift, booksPerPage, likesCount);
  const reviewData = createReviewData(faker, shift, booksPerPage, reviewCount);

  const books = bookData.map((book, i) => ({
    ...book,
    likes: likesPerBook[i],
    reviews: reviewData[i],
  }));

  return books;
}
