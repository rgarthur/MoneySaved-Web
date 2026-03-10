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
                'categoria' => $transacao->categoria,
                'mes_ano' => ucfirst($transacao->data->translatedFormat('F Y'))
            ];
        })->groupBy('mes_ano');
        $mesAtual = ucfirst(Carbon::now()->translatedFormat('F Y'));

        return Inertia::render('extrato', [
            'extratosPorMes' => $extratosPorMes,
            'totalGasto' => number_format($totalGasto, 2, ',', '.'),
            'mesAtual' => $mesAtual,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'descricao' => 'required|string|max:255',
            'valor'     => 'required|numeric',
            'tipo'      => 'required|in:entrada,saida',
            'categoria' => 'nullable|string',
            'data'      => 'required|date',
        ]);

        Transacao::create($validated);

        return redirect()->back();
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'descricao' => 'required|string|max:255',
            'valor'     => 'required|numeric',
            'tipo'      => 'required|in:entrada,saida',
            'categoria' => 'nullable|string',
            'data'      => 'required|date',
        ]);

        $transacao = Transacao::findOrFail($id);

        $transacao->update($validated);

        return redirect()->back();
    }

}
