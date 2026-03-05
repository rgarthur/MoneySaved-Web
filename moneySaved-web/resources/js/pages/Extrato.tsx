import React from 'react';
import Header from '../components/header'

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
        <div className='h-screen flex flex-col'>
            <Header />
            <main className='flex-1 overflow-y-auto'>
                <section className='flex-1 p-10'>
                    <h1>Extrato Mês: {transacoes.}</h1>
                    <table className="min-w-full bg-white rounded-md">
                        <thead>
                            <tr>
                                <th className="border px-4 py-2 text-purple-400">Descrição</th>
                                <th className="border px-4 py-2 text-purple-400">Valor</th>
                                <th className="border px-4 py-2 text-purple-400">Data</th>
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
                            {transacoes.length === 0 && (
                                <tr>
                                    <td className="border px-4 py-2 text-purple-400">Tão Vazio por aqui!</td>
                                    <td className="border px-4 py-2 text-purple-400">Tão Vazio por aqui!</td>
                                    <td className="border px-4 py-2 text-purple-400">Tão Vazio por aqui!</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </section>
            </main>
        </div>
    );
}