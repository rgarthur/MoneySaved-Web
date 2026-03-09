export interface Transacao {
    id: number;
    descricao: string;
    
    valor: number;
    data: string; 
    
    valor_formatado: string; 
    data_formatada: string;
    dia: string;
    mes_ano: string;
    
    tipo: 'entrada' | 'saida';
    categoria: string | null;
}