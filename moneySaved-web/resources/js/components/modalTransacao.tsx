import React, { useEffect } from 'react'; // Adicione o useEffect
import { useForm } from '@inertiajs/react';
import { Transacao } from '@/interfaces/interfaceTransacao';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    transacaoSelecionada?: Transacao | null; 
}

export default function ModalTransacao({ isOpen, onClose, transacaoSelecionada }: ModalProps) {
    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        descricao: '',
        valor: '',
        data: '',
        tipo: 'saida',
    });

    useEffect(() => {
        if (transacaoSelecionada) {
            setData({
                descricao: transacaoSelecionada.descricao,
                valor: transacaoSelecionada.valor.toString(), 
                data: transacaoSelecionada.data, 
                tipo: transacaoSelecionada.tipo,
            });
        } else {
            reset(); 
        }
    }, [transacaoSelecionada, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (transacaoSelecionada) {
            put(`/extrato/${transacaoSelecionada.id}`, {
                onSuccess: () => onClose(),
            });
        } else {
            post('/extrato', {
                onSuccess: () => { reset(); onClose(); },
            });
        }
    };

    const handleDeletar = () => {
        if (confirm('Tem certeza que deseja apagar esta transação?')) {
            destroy(`/extrato/${transacaoSelecionada?.id}`, {
                onSuccess: () => onClose(),
            });
        }
    };

    const handleClose = () => { reset(); onClose(); };

    const isEditing = !!transacaoSelecionada;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={handleClose}>
            <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200" onClick={(e) => e.stopPropagation()}>
                
                <div className="flex flex-col gap-1 px-6 pt-6">
                    <h2 className="text-xl font-bold text-gray-900">
                        {isEditing ? 'Detalhes da Transação' : 'Nova Transação'}
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 py-6">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-700">Descrição</label>
                        <input 
                            required 
                            type="text" 
                            value={data.descricao}
                            onChange={(e) => setData('descricao', e.target.value)}
                            placeholder="Ex: Mercado, Conta de Luz..." 
                            className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                        />
                        {errors.descricao && <span className="text-xs text-red-500">{errors.descricao}</span>}
                    </div>

                    <div className="flex gap-4">
                        <div className="flex flex-col gap-1.5 w-1/2">
                            <label className="text-sm font-medium text-gray-700">Valor (R$)</label>
                            <input 
                                required 
                                type="number" 
                                step="0.01"
                                value={data.valor}
                                onChange={(e) => setData('valor', e.target.value)}
                                placeholder="0,00" 
                                className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                            />
                            {errors.valor && <span className="text-xs text-red-500">{errors.valor}</span>}
                        </div>

                        <div className="flex flex-col gap-1.5 w-1/2">
                            <label className="text-sm font-medium text-gray-700">Data</label>
                            <input 
                                required 
                                type="date"
                                value={data.data}
                                onChange={(e) => setData('data', e.target.value)} 
                                className="relative w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0" 
                            />
                            {errors.data && <span className="text-xs text-red-500">{errors.data}</span>}
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-700">Tipo da Transação</label>
                        <select 
                            value={data.tipo}
                            onChange={(e) => setData('tipo', e.target.value)}
                            className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="saida">Saída (Despesa)</option>
                            <option value="entrada">Entrada (Receita)</option>
                        </select>
                        {errors.tipo && <span className="text-xs text-red-500">{errors.tipo}</span>}
                    </div>
                    <div className="mt-2 flex gap-3 pt-4 border-t border-gray-100">
                        
                        {isEditing && (
                            <button 
                                type="button" 
                                onClick={handleDeletar}
                                disabled={processing}
                                className="mr-auto text-sm font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
                            >
                                Excluir
                            </button>
                        )}

                        <button type="button" onClick={handleClose} className="rounded-lg px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">
                            Cancelar
                        </button>
                        
                        <button type="submit" disabled={processing} className="rounded-lg px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                            {processing ? 'Processando...' : (isEditing ? 'Atualizar' : 'Salvar')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}