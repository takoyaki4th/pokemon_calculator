import ReactDOM from 'react-dom/client';
import 'normalize.css';
import './index.css';
import {App} from './components/App';
import { DexNumberProvider } from './components/providers/DexNumberProvider';
import { PokeFormProvider } from './components/providers/PokeFormProvider';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <>
    <DexNumberProvider>
      <PokeFormProvider>
        <App />
      </PokeFormProvider>
    </DexNumberProvider>
  </>
);