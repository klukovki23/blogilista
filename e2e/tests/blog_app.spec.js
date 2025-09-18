const { test, expect, describe, beforeEach } = require('@playwright/test')
const { createBlog, loginWith, createAnotherBlog } = require('./helper')
test.use({ browserName: 'chromium' });

describe('Blog app', () => {

  beforeEach(async ({ page, request }) => {

    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {

    console.log(await page.content());
    await expect(page.getByLabel('username')).toBeVisible()
  })

  describe('Login', () => {

    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByText(' Matti Luukkainen logged in')).toBeVisible()
    })

    test('login fails with wrong password', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong')
      await page.getByRole('button', { name: 'login' }).click()

      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('wrong username or password')
      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'a new blog', 'a new author', 'a new url')
      await page.reload();
      await expect(page.getByText('a new blog a new author')).toBeVisible()
    })

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'a new blog', 'a new author', 'a new url')
        await page.reload();
      })

      test('a new blog can be liked', async ({ page }) => {
        const blog = page.getByText('a new blog a new author');
        const likes = page.getByText('likes')
        await blog.getByRole('button', { name: 'view' }).click();

        await likes.getByRole('button', { name: 'like' }).click();

        await expect(page.getByText('likes 1')).toBeVisible();
      })

      test('a new blog can be deleted', async ({ page }) => {
        const blog = page.getByText('a new blog a new author');

        await blog.getByRole('button', { name: 'view' }).click();

        page.on('dialog', async dialog => {

          await dialog.accept();
        })

        await page.getByRole('button', { name: 'remove' }).filter({ hasText: 'remove' }).click();

        await expect(page.getByText('a new blog a new author')).not.toBeVisible();
      })

    })

    test('blogs ordered by amount of likes', async ({ page }) => {

      await createBlog(page, 'Title 1', 'Author 2', 'url-1');
      await createAnotherBlog(page, 'Title 2', 'Author 2', 'url-2');
      await createAnotherBlog(page, 'Title 3', 'Author 3', 'url-3');

      const blogs = page.locator('.blog')

      const blog1 = page.getByText('Title 1').locator('..');
      await blog1.getByRole('button', { name: 'view' }).click();
      await blog1.getByRole('button', { name: 'like' }).click();

      const blog2 = page.getByText('Title 2').locator('..')
      await blog2.getByRole('button', { name: 'view' }).click();
      for (let i = 0; i < 5; i++) {
        await blog2.getByRole('button', { name: 'like' }).click();

      }

      await expect(blogs.nth(0)).toContainText('Title 2');
      await expect(blogs.nth(1)).toContainText('Title 1');
      await expect(blogs.nth(2)).toContainText('Title 3');

    })

  })

  describe('two users', () => {

    test('remove button not visible for not owner of the blog', async ({ page, request }) => {

      await request.post('/api/users', {
        data: {
          name: 'Kseniia',
          username: 'klukovki',
          password: 'salasana'
        }
      })

      await loginWith(page, 'klukovki', 'salasana')
      await createBlog(page, 'a new blog', 'a new author', 'a new url')
      await page.getByRole('button', { name: 'logout' }).filter({ hasText: 'logout' }).click();

      await loginWith(page, 'mluukkai', 'salainen')
      const blog = page.getByText('a new blog a new author');

      await blog.getByRole('button', { name: 'view' }).click();
      await expect(page.getByRole('button', { name: 'remove' }).filter({ hasText: 'remove' })).not.toBeVisible()

    }
    )

  })
})
