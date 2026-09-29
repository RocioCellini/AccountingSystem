<?php

namespace App\Providers;

use App\Database\Grammars\SqlServerGrammar;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Log;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        $connection = DB::connection('sqlsrv');

        $grammar = new SqlServerGrammar();

        $grammar->setTablePrefix($connection->getTablePrefix());

        $connection->setQueryGrammar($grammar);

       /*  Log::info('GRAMMAR SQL SERVER', [
            'class' => get_class($connection->getQueryGrammar()),
            'date_format' => $connection->getQueryGrammar()->getDateFormat(),
        ]); */
    }

}
