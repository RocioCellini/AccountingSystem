<?php

namespace App\Exports;

use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;


class UsuariosExport implements  FromCollection, WithHeadings, WithColumnWidths, WithStyles
{
    private $usuarios;

    public function __construct($usuarios)
    {
        $this->usuarios = $usuarios;
    }


    public function collection()
    {
        $data = collect($this->usuarios);

        return $data;
    }

    public function headings(): array
    {
        return [
            'Usuario',
            'Correo',
            'Perfil',
            'Estado'
        ];
    }

    public function title(): string
    {
        $fecha = Carbon::now()->format('Y-m-d_h:i:s');
        return 'usuarios_activos_'.$fecha;

    }

    public function styles(Worksheet $sheet)
    {
        $sheet->setAutoFilter('A1:D1');

        return [
            // Style the first row as bold text.
            1    => ['font' => ['bold' => true]],
        ];
    }

    public function columnWidths(): array
    {
        return [
            'A' => 25,
            'B' => 30,
            'C' => 20,
            'D' => 15,
        ];
    }

}
