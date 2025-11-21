import xIcon from '../../assets/cross.svg'; // adapte l'extension si besoin (.webp)

interface SymbolProps {
    size?: number;
}

export function SymbolX({ size = 64 }: SymbolProps) {
    return (
        <img
            src={xIcon}
            alt="Symbole X"
            style={{ width: size, height: size }}
            draggable={false}
        />
    );
}
