import React from 'react';

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

export default function Extrato({ transacoes }: Props) {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Meu Extrato Bancário 💰</h1>
            
            <table className="min-w-full bg-white border">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">Descrição</th>
                        <th className="border px-4 py-2">Valor</th>
                        <th className="border px-4 py-2">Data</th>
                    </tr>
                </thead>
                <tbody>
                   {transacoes.map((transacao) => (
                        <tr key={transacao.id}>
                            <td className="border px-4 py-2">{transacao.descricao}</td>
                            <td className="border px-4 py-2">{transacao.valor}</td>
                            <td className="border px-4 py-2">{transacao.data}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}