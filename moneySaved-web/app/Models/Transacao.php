<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transacao extends Model
{
    protected $fillable = [
        'descricao',
        'valor',
        'tipo',
        'forma_pagamento',
        'parcelas',
        'data',
        'group_id',
        'instituicao',
        'logo_path',
    ];

    protected $casts = [
        'data' => 'datetime',
        'valor' => 'decimal:2',
    ];
}
