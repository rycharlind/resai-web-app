// Import your page components
import HomePage from './routes/HomePage.svelte';
import AboutPage from './routes/AboutPage.svelte';
import NotFoundPage from './routes/NotFoundPage.svelte';

// Define your routes
const routes = {
  '/': HomePage,
  '/about': AboutPage,
  '*': NotFoundPage,
};

export default routes;