<?php

namespace App\Database\Grammars;

use Illuminate\Database\Query\Grammars\SqlServerGrammar as BaseSqlServerGrammar;

class SqlServerGrammar extends BaseSqlServerGrammar
{
    /**
     * SQL Server con language Español/dateformat dmy no interpreta
     * correctamente el formato Y-m-d H:i:s.v utilizado por Laravel.
     * El formato ISO 8601 con 'T' es interpretado correctamente.
     *
     * @return string
     */
    public function getDateFormat()
    {
        return 'Y-m-d\TH:i:s.v';
    }
}