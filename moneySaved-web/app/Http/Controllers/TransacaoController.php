<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class TransacaoController extends Controller
{
    public function index()
    {
        $transacoes = Transacao::orderBy('data', 'desc')->get()->map(function ($transacao) {
        return [
            'id' => $transacao->id,
            'descricao' => $transacao->descricao,
            'valor' => number_format($transacao->valor, 2, ',', '.'),
            'tipo' => $transacao->tipo,
            'categoria' => $transacao->categoria,
            'data' => $transacao->data->format('d/m/Y H:i'), 
        ];
    });
        return Inertia::render('Extrato', [
            'transacoes' => $transacoes
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
}
