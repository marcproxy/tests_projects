import { setupServer } from 'msw/node'
import { handlers } from './handlers-v1'

// This configures a request mocking server with the given request handlers
export const server = setupServer(...handlers)
