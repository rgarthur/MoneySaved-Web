<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Transacao;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Str;

class TransacaoController extends Controller
{
    public function index(Request $request)
    {
        $mes = $request->input('mes', Carbon::now()->month);
        $ano = $request->input('ano', Carbon::now()->year);

        $transacoes = Transacao::whereMonth('data', $mes)
                           ->whereYear('data', $ano)
                           ->orderBy('data', 'desc')
                           ->get();

        $totalGasto = $transacoes->where('tipo', 'saida')->sum('valor');

        $extratos = $transacoes->map(function ($transacao) {
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
                'instituicao' => $transacao->instituicao,
                'logo_path' => $transacao->logo_path,
            ];
        })->values();

        $mesAtualNome = ucfirst(Carbon::createFromDate($ano, $mes, 1)->translatedFormat('F Y'));

        $filtroAtual = sprintf('%04d-%02d', $ano, $mes);

        return Inertia::render('extrato', [
            'transacoes' => $extratos,
            'totalGasto' => number_format($totalGasto, 2, ',', '.'),
            'mesAtual' => $mesAtualNome,
            'filtroAtual' => $filtroAtual
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'descricao' => 'required|string|max:255',
            'valor'     => 'required|numeric',
            'tipo'      => 'required|in:entrada,saida',
            'forma_pagamento' => 'required|string',
            'parcelas' => 'nullable|integer|min:1',
            'data'      => 'required|date',
            'instituicao' => 'nullable|string|max:100',
        ]);

        $parcelas = $request->input('parcelas', 1); 

        if ($validated['forma_pagamento'] === 'credito' && $parcelas > 1) {
            
            $valorParcela = $validated['valor'] / $parcelas;
            $dataBase = Carbon::parse($validated['data']);
            $group_id = Str::uuid();

            for ($i = 0; $i < $parcelas; $i++) {
                Transacao::create([
                    'descricao'       => $validated['descricao'] . ' (' . ($i + 1) . '/' . $parcelas . ')',
                    'valor'           => $valorParcela,
                    'data'            => (clone $dataBase)->addMonths($i), 
                    'tipo'            => $validated['tipo'],
                    'forma_pagamento' => $validated['forma_pagamento'],
                    'parcelas'        => $parcelas,
                    'group_id'        => $group_id,
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
            'forma_pagamento' => 'required|string',
            'parcelas' => 'nullable|integer|min:1',
            'data'      => 'required|date',
            'instituicao' => 'nullable|string|max:100',
        ]);

        $transacao = Transacao::findOrFail($id);
        $parcelas = $request->input('parcelas', 1); 

        $eraAVista = $transacao->parcelas <= 1 || $transacao->parcelas === null;
        $vaiSerParcelado = $validated['forma_pagamento'] === 'credito' && $parcelas > 1;

        if ($eraAVista && $vaiSerParcelado) {
        $valorParcela = $validated['valor'] / $parcelas;
        $dataBase = Carbon::parse($validated['data']);
        $grupoId = Str::uuid();

        $transacao->update([
            'descricao' => $validated['descricao'] . ' (1/' . $parcelas . ')',
            'valor' => $valorParcela,
            'forma_pagamento' => 'credito',
            'parcelas' => $parcelas,
            'grupo_id' => $grupoId,
            'data' => $dataBase,
            'tipo' => $validated['tipo'],
        ]);

        for ($i = 1; $i < $parcelas; $i++) {
            Transacao::create([
                'descricao' => $validated['descricao'] . ' (' . ($i + 1) . '/' . $parcelas . ')',
                'valor' => $valorParcela,
                'data' => (clone $dataBase)->addMonths($i),
                'tipo' => $validated['tipo'],
                'forma_pagamento' => 'credito',
                'parcelas' => $parcelas,
                'grupo_id' => $grupoId,
            ]);
        }
    } else {
        $transacao->update($validated);
    }
        return redirect()->back();
    }

    public function destroy(Request $request, $id)
    {
        $transacao = Transacao::findOrFail($id);

        if ($request->query('todas') === 'true' && $transacao->grupo_id) {

            Transacao::where('grupo_id', $transacao->grupo_id)->delete();
        } else {

            $transacao->delete();
        }

        return redirect()->back();
    }

}
