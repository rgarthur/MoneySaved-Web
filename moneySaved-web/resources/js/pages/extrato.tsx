import React from 'react';
import Header from '../components/header'

interface Transacao {
    id: number;
    descricao: string;
    valor: number;
    categoria: string | null;
    tipo: 'entrada' | 'saida';
    data: string;
    dia: string;
}

interface Props {
    extratosPorMes: Record<string, Transacao[]>;
    totalGasto: number;
    mesAtual: string;
}

export default function Extrato({ extratosPorMes, totalGasto }: Props) {
    return (
        <div className='h-screen flex flex-col'>
            <Header />
            <main className='flex-1 overflow-y-auto'>
                {Object.entries(extratosPorMes).map(([mesAno, transacoes]) => (
                <section key={mesAno} className="mb-8">
                    <h3 className="text-xl font-bold">{mesAno}</h3>
                    
                    <table className="min-w-full">
                        <tbody>
                            {transacoes.map(transacao => (
                                <tr key={transacao.id}>
                                    <td>Dia {transacao.dia}</td>
                                    <td>{transacao.descricao}</td>
                                    <td>R$ {transacao.valor}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            ))}
            </main>
        </div>
    );
}