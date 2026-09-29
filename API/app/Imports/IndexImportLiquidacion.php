<?php

namespace App\Imports;

use App\Models\Indice;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class IndexImportLiquidacion implements WithMultipleSheets
{
    protected $periodo;
    protected $empresa;

    public function __construct($periodo,$empresa)
    {
        $this->periodo = $periodo;
        $this->empresa = $empresa;
    }


    public function sheets(): array
    {
        return [
            'Sheet' => new ImportLiquidacion($this->periodo,$this->empresa),
        ];
    }
}
