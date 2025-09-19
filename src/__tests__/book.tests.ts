import db, {sequelize} from '../database/models';
import {BookService} from '../services/bookService';
import Book from '../database/models/book';
import {RoleType} from '../utils/enums';

describe('Book tests', () => {
  beforeEach(async () => {
    await sequelize.sync({force: true});
    await db.User.create({
      uuid: '956b086d-f22d-43a3-8966-77d412555c3e',
      firstName: 'Petar',
      lastName: 'Petrovic',
      password: 'test123',
      email: 'petar@gmail.com',
      username: 'petar80',
      active: true,
      role: RoleType.Admin,
    });
    await db.Book.create({
      id: 1,
      userUid: '956b086d-f22d-43a3-8966-77d412555c3e',
      title: 'Book Title',
      description: 'Book description',
      genre: 'Classic',
      publisher: 'Vulcan',
      numberOfPages: 300,
    });
  });

  it("After book is deleted, it shouldn't be possible to fetch it", async () => {
    const bookService = new BookService();
    const book: Book = await bookService.getBookById(1);
    await bookService.deleteBook(book.id);
    const bookRefetch: Book = await bookService.getBookById(1);
    expect(bookRefetch).toBeNull();
  });

  it('After book title is changed in db to New Title book should have New Title title on fetch', async () => {
    const bookService = new BookService();
    const book: Book = await bookService.getBookById(1);
    const bookData = {
      title: 'New Title',
    };
    const updatedBook = await bookService.updateBook(book.id, bookData);
    expect(updatedBook.title).toBe('New Title');
  });

  it('After book is created it should be exists in database', async () => {
    const bookService = new BookService();
    const book: Book = await bookService.getBookById(1);
    expect(book).toBeDefined();
  });
});
