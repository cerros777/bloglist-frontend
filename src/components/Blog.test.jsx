import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

describe('<Blog />', () => {
  let container;

  const blog = {
    id: '1',
    title: 'Test Title',
    author: 'Me',
    likes: 10,
    url: 'http://example.com',
    user: {
      id: 'user1',
      username: 'me',
      name: 'User Name'
    }
  };

  const user = {
    id: 'user1',
    username: 'me',
    name: 'User Name'
  };

  const mockOnLike = vi.fn();
  const mockDeleteBlog = vi.fn();

  beforeEach(() => {
    container = render(
      <Blog blog={blog} user={user} onLike={mockOnLike} deleteBlog={mockDeleteBlog} />
    ).container;
  });

  test('renders title and author', () => {
    const titleElement = screen.getByText('Test Title');
    expect(titleElement).toBeDefined();

    const authorElement = screen.getByText('Me');
    expect(authorElement).toBeDefined();
  });

  test('at start the URL and likes are not displayed', () => {
    const div = container.querySelector('.hidenDiv');
    expect(div).toHaveStyle('display: none');
  });

  test('after clicking the button, URL and likes are displayed', async () => {
    const user = userEvent.setup();
    const button = screen.getByText('view');
    await user.click(button);

    const div = container.querySelector('.hidenDiv');
    expect(div).not.toHaveStyle('display: none');

    const urlElement = screen.getByText('http://example.com');
    expect(urlElement).toBeDefined();

    const likesElement = screen.getByText('likes 10');
    expect(likesElement).toBeDefined();
  });

  test('if the like button is clicked twice, the event handler is called twice', async () => {
    const user = userEvent.setup();
    const viewButton = screen.getByText('view');
    await user.click(viewButton);

    const likeButton = screen.getByText('like');
    await user.click(likeButton);
    await user.click(likeButton);

    expect(mockOnLike).toHaveBeenCalledTimes(2);
  });
});
