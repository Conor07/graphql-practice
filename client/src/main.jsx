import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  from
} from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { ApolloProvider } from '@apollo/client/react'

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) console.error('GraphQL errors:', graphQLErrors)
  if (networkError) console.error('Network error:', networkError)
})

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql' // adjust to your server's actual GraphQL endpoint
})

const client = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache(),
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>,
)
