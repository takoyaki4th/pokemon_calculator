import ReactDOM from 'react-dom/client';
import 'normalize.css';
import './index.css';
import {App} from './components/App';
import { SpecieProvider } from './components/providers/SpecieProvider';
import { PokeFormProvider } from './components/providers/PokeFormProvider';
import { MoveProvider } from './components/providers/MoveProvider';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <>
    <SpecieProvider>
      <PokeFormProvider>
        <MoveProvider>
          <App />
        </MoveProvider>
      </PokeFormProvider>
    </SpecieProvider>
  </>
);