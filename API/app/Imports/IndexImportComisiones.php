<?php

namespace App\Imports;

use App\Models\Indice;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class IndexImportComisiones implements WithMultipleSheets
{
    /**
    * @param Collection $collection
    */
    public function sheets(): array
    {

        return [
            'Nomina' => new ImportComisiones(),
        ];
    }
}
