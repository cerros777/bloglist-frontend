import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NewBlogForm from './NewBlogForm';

describe('<NewBlogForm />', () => {
  let createBlogMock;

  beforeEach(() => {
    createBlogMock = vi.fn();
    render(<NewBlogForm createBlog={createBlogMock} />);
  });

  test('calls createBlog with the right details when a new blog is created', async () => {
    const user = userEvent.setup();

    // Fill out the form
    await user.type(screen.getByPlaceholderText('title'), 'Test Title');
    await user.type(screen.getByPlaceholderText('author'), 'Test Author');
    await user.type(screen.getByPlaceholderText('url'), 'http://example.com');

    // Submit the form
    await user.click(screen.getByText('create'));

    // Check that createBlog was called with the correct details
    expect(createBlogMock).toHaveBeenCalledWith({
      title: 'Test Title',
      author: 'Test Author',
      url: 'http://example.com'
    });

    // Check that form fields are cleared
    expect(screen.getByPlaceholderText('title')).toHaveValue('');
    expect(screen.getByPlaceholderText('author')).toHaveValue('');
    expect(screen.getByPlaceholderText('url')).toHaveValue('');
  });
});
