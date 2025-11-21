import { SymbolX } from './SymbolX';
import { SymbolO } from './SymbolO';

export function LogoXO() {
    return (
        <div className="logo-xo" aria-label="Logo XO">
            <SymbolX size={24} />
            <SymbolO size={24} />
        </div>
    );
}
