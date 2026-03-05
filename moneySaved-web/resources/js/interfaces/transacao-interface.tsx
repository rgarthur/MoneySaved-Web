interface Transacao {
    id: number;
    descricao: string;
    valor: number;
    categoria: string | null;
    tipo: 'entrada' | 'saida';
    data: string;
}

interface Props {
    transacoes: Transacao[];
}