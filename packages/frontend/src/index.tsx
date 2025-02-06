import ReactDOM from 'react-dom/client';
import './index.css';
import {App} from './components/App';
import { DexNumberProvider } from './components/providers/DexNumberProvider';
import { PokeFormProvider } from './components/providers/PokeFormProvider';
import 'normalize.css';

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