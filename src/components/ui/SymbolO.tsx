import oIcon from '../../assets/circle.svg';

interface SymbolProps {
    size?: number;
}

export function SymbolO({ size = 64 }: SymbolProps) {
    return (
        <img
            src={oIcon}
            alt="Symbole O"
            style={{ width: size, height: size }}
            draggable={false}
        />
    );
}
