<?php

use Illuminate\Support\Str;

return [

    /*
    |--------------------------------------------------------------------------
    | Default Database Connection Name
    |--------------------------------------------------------------------------
    |
    | Here you may specify which of the database connections below you wish
    | to use as your default connection for all database work. Of course
    | you may use many connections at once using the Database library.
    |
    */

    'default' => env('DB_CONNECTION', 'mysql'),

    /*
    |--------------------------------------------------------------------------
    | Database Connections
    |--------------------------------------------------------------------------
    |
    | Here are each of the database connections setup for your application.
    | Of course, examples of configuring each database platform that is
    | supported by Laravel is shown below to make development simple.
    |
    |
    | All database work in Laravel is done through the PHP PDO facilities
    | so make sure you have the driver for your particular database of
    | choice installed on your machine before you begin development.
    |
    */

    'connections' => [

        'sqlite' => [
            'driver' => 'sqlite',
            'url' => env('DATABASE_URL'),
            'database' => env('DB_DATABASE', database_path('database.sqlite')),
            'prefix' => '',
            'foreign_key_constraints' => env('DB_FOREIGN_KEYS', true),
        ],

        'mysql' => [
            'driver' => 'mysql',
            'url' => env('DATABASE_URL'),
            'host' => env('DB_HOST', '127.0.0.1'),
            'port' => env('DB_PORT', '3306'),
            'database' => env('DB_DATABASE', 'forge'),
            'username' => env('DB_USERNAME', 'forge'),
            'password' => env('DB_PASSWORD', ''),
            'unix_socket' => env('DB_SOCKET', ''),
            'charset' => 'utf8mb4',
            'collation' => 'utf8mb4_unicode_ci',
            'prefix' => '',
            'prefix_indexes' => true,
            'strict' => true,
            'engine' => null,
            'options' => extension_loaded('pdo_mysql') ? array_filter([
                PDO::MYSQL_ATTR_SSL_CA => env('MYSQL_ATTR_SSL_CA'),
            ]) : [],
        ],

        'pgsql' => [
            'driver' => 'pgsql',
            'url' => env('DATABASE_URL'),
            'host' => env('DB_HOST', '127.0.0.1'),
            'port' => env('DB_PORT', '5432'),
            'database' => env('DB_DATABASE', 'forge'),
            'username' => env('DB_USERNAME', 'forge'),
            'password' => env('DB_PASSWORD', ''),
            'charset' => 'utf8',
            'prefix' => '',
            'prefix_indexes' => true,
            'schema' => 'public',
            'sslmode' => 'prefer',
        ],

        'sqlsrv' => [
            'driver' => 'sqlsrv',
            'url' => env('DATABASE_URL'),
            'host' => env('DB_HOST', 'localhost'),
            'port' => env('DB_PORT', '1433'),
            'database' => env('DB_DATABASE', 'forge'),
            'username' => env('DB_USERNAME', 'forge'),
            'password' => env('DB_PASSWORD', ''),
            'charset' => 'utf8',
            'prefix' => '',
            'prefix_indexes' => true,
            'trust_server_certificate' => true,
        ],

        'vfondos' => [
            'driver' => 'sqlsrv',
            'host' => env('ESCO_FONDOS_HOST', 'localhost'),
            'port' => env('ESCO_FONDOS_PORT', '1433'),
            'database' => env('ESCO_FONDOS_DATABASE', 'forge'),
            'username' => env('ESCO_FONDOS_USERNAME', 'forge'),
            'password' => env('ESCO_FONDOS_PASSWORD', ''),
            'charset' => 'utf8',
            'prefix' => '',
        ],

        'vbolsa' => [
            'driver' => 'sqlsrv',
            'host' => env('ESCO_BOLSA_HOST', 'localhost'),
            'port' => env('ESCO_BOLSA_PORT', '1433'),
            'database' => env('ESCO_BOLSA_DATABASE', 'forge'),
            'username' => env('ESCO_BOLSA_USERNAME', 'forge'),
            'password' => env('ESCO_BOLSA_PASSWORD', ''),
            'charset' => 'utf8',
            'prefix' => '',
        ],

        'arrow' => [
            'driver' => 'sqlsrv',
            'host' => env('ARROW_HOST', 'localhost'),
            'port' => env('ARROW_PORT', '1433'),
            'database' => env('ARROW_DATABASE', 'forge'),
            'username' => env('ARROW_USERNAME', 'forge'),
            'password' => env('ARROW_PASSWORD', ''),
            'charset' => 'utf8',
            'prefix' => '',
        ],

        'seeker' => [
            'driver' => 'sqlsrv',
            'host' => env('SEEKER_HOST', 'localhost'),
            'port' => env('SEEKER_PORT', '1433'),
            'database' => env('SEEKER_DATABASE', 'forge'),
            'username' => env('SEEKER_USERNAME', 'forge'),
            'password' => env('SEEKER_PASSWORD', ''),
            'charset' => 'utf8',
            'prefix' => '',
        ],

        'CIBSA' => [
            'driver' => 'sqlsrv',
            'host' => env('ESCO_CIBSA_HOST', 'localhost'),
            'port' => env('ESCO_CIBSA_PORT', '1433'),
            'database' => env('ESCO_CIBSA_DATABASE', 'forge'),
            'username' => env('ESCO_CIBSA_USERNAME', 'forge'),
            'password' => env('ESCO_CIBSA_PASSWORD', ''),
            'charset' => 'utf8',
            'prefix' => '',
            'trust_server_certificate' => true,
        ],

        'GAINVEST' => [
            'driver' => 'sqlsrv',
            'host' => env('ESCO_GAINVEST_HOST', 'localhost'),
            'port' => env('ESCO_GAINVEST_PORT', '1433'),
            'database' => env('ESCO_GAINVEST_DATABASE', 'forge'),
            'username' => env('ESCO_GAINVEST_USERNAME', 'forge'),
            'password' => env('ESCO_GAINVEST_PASSWORD', ''),
            'charset' => 'utf8',
            'prefix' => '',
            'trust_server_certificate' => true,
        ],

        'CAPITAL' => [
            'driver' => 'sqlsrv',
            'host' => env('ESCO_CAPITAL_HOST', 'localhost'),
            'port' => env('ESCO_CAPITAL_PORT', '1433'),
            'database' => env('ESCO_CAPITAL_DATABASE', 'forge'),
            'username' => env('ESCO_CAPITAL_USERNAME', 'forge'),
            'password' => env('ESCO_CAPITAL_PASSWORD', ''),
            'charset' => 'utf8',
            'prefix' => '',
            'trust_server_certificate' => true,
        ],

        'FCSTONE' => [
            'driver' => 'sqlsrv',
            'host' => env('ESCO_FCSTONE_HOST', 'localhost'),
            'port' => env('ESCO_FCSTONE_PORT', '1433'),
            'database' => env('ESCO_FCSTONE_DATABASE', 'forge'),
            'username' => env('ESCO_FCSTONE_USERNAME', 'forge'),
            'password' => env('ESCO_FCSTONE_PASSWORD', ''),
            'charset' => 'utf8',
            'prefix' => '',
            'trust_server_certificate' => true,
        ],


    ],

    /*
    |--------------------------------------------------------------------------
    | Migration Repository Table
    |--------------------------------------------------------------------------
    |
    | This table keeps track of all the migrations that have already run for
    | your application. Using this information, we can determine which of
    | the migrations on disk haven't actually been run in the database.
    |
    */

    'migrations' => 'migrations',

    /*
    |--------------------------------------------------------------------------
    | Redis Databases
    |--------------------------------------------------------------------------
    |
    | Redis is an open source, fast, and advanced key-value store that also
    | provides a richer body of commands than a typical key-value system
    | such as APC or Memcached. Laravel makes it easy to dig right in.
    |
    */

    'redis' => [

        'client' => env('REDIS_CLIENT', 'phpredis'),

        'options' => [
            'cluster' => env('REDIS_CLUSTER', 'redis'),
            'prefix' => env('REDIS_PREFIX', Str::slug(env('APP_NAME', 'laravel'), '_').'_database_'),
        ],

        'default' => [
            'url' => env('REDIS_URL'),
            'host' => env('REDIS_HOST', '127.0.0.1'),
            'password' => env('REDIS_PASSWORD', null),
            'port' => env('REDIS_PORT', '6379'),
            'database' => env('REDIS_DB', '0'),
        ],

        'cache' => [
            'url' => env('REDIS_URL'),
            'host' => env('REDIS_HOST', '127.0.0.1'),
            'password' => env('REDIS_PASSWORD', null),
            'port' => env('REDIS_PORT', '6379'),
            'database' => env('REDIS_CACHE_DB', '1'),
        ],



    ],

];
