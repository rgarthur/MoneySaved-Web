<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Transacao;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class TransacaoController extends Controller
{
    public function index()
    {
        $transacoes = Transacao::orderBy('data', 'asc')->get();

        $totalGasto = $transacoes->where('tipo', 'saida')->sum('valor');

        $totalGastoMes = $transacoes->where('tipo', 'saida')->filter(function ($transacao) {
        return $transacao->data->isCurrentMonth() && $transacao->data->isCurrentYear();
        })->sum('valor');

        $extratosPorMes = $transacoes->map(function ($transacao) {
            return [
                'id' => $transacao->id,
                'descricao' => $transacao->descricao,
                
                'valor_formatado' => number_format($transacao->valor, 2, ',', '.'),
                'data_formatada' => $transacao->data->format('d/m/Y H:i'),
                'dia' => $transacao->data->format('d'),
                
                'valor' => $transacao->valor,
                'data' => $transacao->data->format('Y-m-d'),
    
                'tipo' => $transacao->tipo,
                'forma_pagamento' => $transacao->forma_pagamento,
                'parcelas' => $transacao->parcelas,
                'categoria' => $transacao->categoria,
                'mes_ano' => ucfirst($transacao->data->translatedFormat('F Y'))
            ];
        })->groupBy('mes_ano');

        $mesAtual = ucfirst(Carbon::now()->translatedFormat('F Y'));

        return Inertia::render('extrato', [
            'extratosPorMes' => $extratosPorMes,
            'totalGasto' => number_format($totalGasto, 2, ',', '.'),
            'totalGastoMes' => number_format($totalGastoMes, 2, ',', '.'),
            'mesAtual' => $mesAtual,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'descricao' => 'required|string|max:255',
            'valor'     => 'required|numeric',
            'tipo'      => 'required|in:entrada,saida',
            'categoria' => 'required|string',
            'forma_pagamento' => 'required|string',
            'parcelas' => 'nullable|integer|min:1',
            'data'      => 'required|date',
        ]);

        $parcelas = $request->input('parcelas', 1); 

        if ($validated['forma_pagamento'] === 'credito' && $parcelas > 1) {
            
            $valorParcela = $validated['valor'] / $parcelas;
            $dataBase = Carbon::parse($validated['data']);

            for ($i = 0; $i < $parcelas; $i++) {
                Transacao::create([
                    'descricao'       => $validated['descricao'] . ' (' . ($i + 1) . '/' . $parcelas . ')',
                    'valor'           => $valorParcela,
                    'data'            => (clone $dataBase)->addMonths($i), 
                    'tipo'            => $validated['tipo'],
                    'forma_pagamento' => $validated['forma_pagamento'],
                    'parcelas'        => $parcelas,
                ]);
            }
        } else {
            Transacao::create($validated);
        }

        return redirect()->back();
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'descricao' => 'required|string|max:255',
            'valor'     => 'required|numeric',
            'tipo'      => 'required|in:entrada,saida',
            'categoria' => 'required|string',
            'forma_pagamento' => 'required|string',
            'parcelas' => 'nullable|integer|min:1',
            'data'      => 'required|date',
        ]);

        $transacao = Transacao::findOrFail($id);

        $parcelas = $request->input('parcelas', 1); 

        if ($validated['forma_pagamento'] === 'credito' && $parcelas > 1) {
            
            $valorParcela = $validated['valor'] / $parcelas;
            $dataBase = Carbon::parse($validated['data']);

            for ($i = 0; $i < $parcelas; $i++) {
                Transacao::create([
                    'descricao'       => $validated['descricao'] . ' (' . ($i + 1) . '/' . $parcelas . ')',
                    'valor'           => $valorParcela,
                    'data'            => (clone $dataBase)->addMonths($i), 
                    'tipo'            => $validated['tipo'],
                    'forma_pagamento' => $validated['forma_pagamento'],
                    'parcelas'        => $parcelas,
                ]);
            }
        } else {
            Transacao::create($validated);
        }


        return redirect()->back();
    }

    public function destroy(Request $request, $id)
    {
        $transacao = Transacao::findOrFail($id);

        $transacao->delete();

        return redirect()->back();
    }

}
