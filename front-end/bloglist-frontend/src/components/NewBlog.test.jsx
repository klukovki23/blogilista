import { render, screen } from '@testing-library/react'
import NewBlog from './NewBlog'
import userEvent from '@testing-library/user-event'

test('<NewBlog /> updates parent state and calls onSubmit', async () => {
    const user = userEvent.setup()
    const createBlog = vi.fn()

    render(<NewBlog createBlog={createBlog} />)

    const titleInput = screen.getByLabelText('title:')
    const authorInput = screen.getByLabelText('author:')
    const urlInput = screen.getByLabelText('url:')
    const sendButton = screen.getByText('create')

    await user.type(titleInput, 'testing title...')
    await user.type(authorInput, 'testing author...')
    await user.type(urlInput, 'testing url...')

    await user.click(sendButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('testing title...')
    expect(createBlog.mock.calls[0][0].author).toBe('testing author...')
    expect(createBlog.mock.calls[0][0].url).toBe('testing url...')
})