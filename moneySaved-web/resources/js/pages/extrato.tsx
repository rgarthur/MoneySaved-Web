import React from 'react';
import Header from '../components/header'
import { useState } from 'react';
import ModalTransacao from '@/components/modalTransacao';
import { Transacao } from '@/interfaces/interfaceTransacao';
import { router } from '@inertiajs/react';

interface Props {
    transacoes: Transacao[];
    totalGasto: string;
    mesAtual: string;
    filtroAtual: string;
}
 

export default function Extrato({ transacoes, mesAtual, totalGasto, filtroAtual }: Props) {
    const [isModalTransacaoOpen, setIsModalTransacaoOpen] = useState(false);
    const [transacaoSelecionada, setTransacaoSelecionada] = useState<Transacao | null>(null);

    const handleMesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = e.target.value; 
        if (!valor) return;

        const [ano, mes] = valor.split('-');

        router.get('/extrato', { mes, ano }, {
            preserveState: true,
            replace: true
        });
    };

    const abrirModalCriar = () => {
        setTransacaoSelecionada(null);
        setIsModalTransacaoOpen(true);
    };

    const abrirModalEditar = (transacao: Transacao) => {
        setTransacaoSelecionada(transacao); 
        setIsModalTransacaoOpen(true);
    };

    const temTransacoes = transacoes.length > 0;

    return (
        <div className='h-screen flex flex-col'>
            <Header />

            <section className="p-10 mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold capitalize">{mesAtual}</h3>
                    
                    <div className="flex gap-4">
                        <input 
                            type="date"     
                            value={filtroAtual}
                            onChange={handleMesChange}
                            className="bg-white text-black px-4 py-2 rounded font-bold outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button onClick={abrirModalCriar} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded transition-colors">
                            + Nova Transação
                        </button>
                        <button className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded transition-colors">
                            Adicionar Banco
                        </button>
                    </div>
                </div>
                <table className="min-w-full bg-white border rounded-2xl">
                    <thead>
                        <tr className='text-black'>
                            <th className="border px-4 py-2 text-left">Dia</th>
                            <th className="border px-4 py-2 text-left">Descrição</th>
                            <th className="border px-4 py-2 text-left">Valor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {temTransacoes ? (
                            transacoes.map((transacao) => (
                                <tr key={transacao.id} onClick={() => abrirModalEditar(transacao)} className='text-black cursor-pointer hover:bg-white/5 transition-colors'>
                                    <td className="border px-4 py-2">{transacao.dia}</td>
                                    <td className="border px-4 py-2">{transacao.descricao}</td>
                                    <td className={`border px-4 py-2 ${transacao.tipo === 'saida' ? 'text-red-500' : 'text-green-500'}`}>R$ {transacao.valor}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="border px-4 py-8 text-center text-gray-500 italic">
                                    Nenhuma transação registrada em {mesAtual}. Comece adicionando uma!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </section>
            <ModalTransacao 
                isOpen={isModalTransacaoOpen} 
                onClose={() => setIsModalTransacaoOpen(false)} 
                transacaoSelecionada={transacaoSelecionada} 
            />
        </div>
    );
}