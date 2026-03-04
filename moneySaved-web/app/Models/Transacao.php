<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transacao extends Model
{
    protected $fillable = [
        'descricao',
        'valor',
        'categoria',
        'tipo',
        'data',
    ];

    protected $casts = [
        'data' => 'datetime',
        'valor' => 'decimal:2',
    ];
}
