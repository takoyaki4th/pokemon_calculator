import ReactDOM from 'react-dom/client';
import './index.css';
import {App} from './components/App';
import { Provider } from './components/providers/GlobalState';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <Provider>
    <App />
  </Provider>
);