import { StrictMode } from 'react';
import { ru } from 'primelocale/js/ru.js';
import { addLocale, locale } from 'primereact/api';
import { createRoot } from 'react-dom/client';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-teal/theme.css';
import { App } from './app';
import './index.css';

addLocale('ru', ru);
locale('ru');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
