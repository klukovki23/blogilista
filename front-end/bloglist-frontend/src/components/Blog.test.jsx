import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders title', () => {
    const blog = {
        title: 'joku',
    }

    render(<Blog blog={blog} />)

    screen.debug()

    const element = screen.getByText('joku')
    expect(element).toBeDefined()
})

test('clicking the like button twice calls event handler twice', async () => {
    const blog = {
        title: 'joku',
        likes: 0
    }

    const mockHandler = vi.fn()

    render(
        <Blog blog={blog} handleLike={mockHandler} />
    )

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)
    const button1 = screen.getByText('like')
    await user.click(button1)
    await user.click(button1)

    expect(mockHandler.mock.calls).toHaveLength(2)
})

test('after clicking the view button, url, likes and username are displayed', async () => {

    const blog = {
        title: 'joku',
        url: 'www',
        likes: 3,
        user: { name: 'Kseniia' }
    }

    render(<Blog blog={blog} />)

    screen.debug()


    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    expect(screen.getByText('www')).toBeVisible()
    expect(screen.getByText(/likes 3/)).toBeVisible()
    expect(screen.getByText('Kseniia')).toBeVisible()

})