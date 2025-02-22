import ReactDOM from 'react-dom/client';
import 'normalize.css';
import './index.css';
import {App} from './components/App';
import { SpecieProvider } from './components/providers/SpecieProvider';
import { PokeFormProvider } from './components/providers/PokeFormProvider';
import { MoveProvider } from './components/providers/MoveProvider';
import { CorrectionsProvider } from './components/providers/CorrectionsProvider';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <>
    <CorrectionsProvider>
      <SpecieProvider>
        <PokeFormProvider>
          <MoveProvider>
            <App />
          </MoveProvider>
        </PokeFormProvider>
      </SpecieProvider>
    </CorrectionsProvider>
  </>
);