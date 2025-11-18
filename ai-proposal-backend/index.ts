import { Hono } from 'hono'
import { serve } from 'bun'

const app = new Hono()
app.get('/', (c) => c.text('Hello'))

serve({
  fetch: app.fetch,
  port: 4000, 
})

console.log('Server running at http://localhost:4000')
