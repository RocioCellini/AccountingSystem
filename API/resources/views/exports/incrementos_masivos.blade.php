<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Incrementos Masivos</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <style>
        body, p, div {
            color: #444444;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 13px;
        }
        body{
            padding-top: 30px;
        }

        table {
            border-collapse: collapse;
            width: 100%;
            margin-bottom: 1rem;
            color: #495057;
            background-color: transparent;
            /*width: 100%;*/
        }
        th, td {
            padding: 15px;

        }
        tbody tr{
            background-color: #fafbfd;
        }

        th {
            height: 30px;
        }
        td {
            height: 30px;
            border-color: #e7eaf3;
        }

        table, th, td {
            border: 1px solid #e6ebf4;
        }

        p.chica {
            font-size: 12px;
        }

        cel-fondo {
            background-color: lightblue;
        }

        .page-break {
            page-break-after: always;
        }

        @page {
            /*margin: 100px 25px;*/
            /*margin-bottom: 80px;*/
            margin-bottom: 50mm;
            margin-top: 2cm;
            /*margin-bottom: 2cm;*/
            margin-left: 2cm;
            margin-right: 2cm;
        }

        header {
            position: fixed;
            top: -60px;
            left: 0px;
            right: 0px;
            background-color: white;
            height: 80px;
            border-bottom: 2px solid #555555;

        }

        footer {
            position: fixed;
            bottom: -60px;
            left: 0px;
            right: 0px;
            background-color: white;
            height: 50px;
        }

        p {
            page-break-after: always;
        }

        p:last-child {
            page-break-after: never;
        }
    </style>

</head>
<body>


<br>

<div class="block-content-full" >

    <table class="table table-vcenter" style="width: 20%; !important;">
        <tbody>

        <tr>
            <td style="background-color: lightgray">Legajo</td>
            <td style="background-color: lightgray">Nombre</td>
            <td style="background-color: lightgray">Fecha Ingreso</td>
            <td style="background-color: lightgray">Sector</td>
            <td style="background-color: lightgray">Empresa</td>
            <td style="background-color: lightgray">Sueldo</td>
            <td style="background-color: lightgray">{{$data[0]->periodos[0]['periodo'] ?? 'T+0'}}</td>
            <td style="background-color: lightgray">{{$data[0]->periodos[1]['periodo'] ?? 'T+1'}}</td>
            <td style="background-color: lightgray">{{$data[0]->periodos[2]['periodo'] ?? 'T+2'}}</td>
            <td style="background-color: lightgray">{{$data[0]->periodos[3]['periodo'] ?? 'T+3'}}</td>
            <td style="background-color: lightgray">{{$data[0]->periodos[4]['periodo'] ?? 'T+4'}}</td>
            <td style="background-color: lightgray">{{$data[0]->periodos[5]['periodo'] ?? 'T+5'}}</td>
        </tr>


        @foreach($data as $empleado)
            <tr>
                <td>{{$empleado->legajo_bejerman}}</td>
                <td>{{$empleado->nombre_apellido}}</td>
                <td>{{$empleado->fecha_ingreso_formatted}}</td>
                <td>{{$empleado->Sector->descripcion}}</td>
                <td>{{$empleado->Empresa->descripcion}}</td>
                <td>{{(int) $empleado->ultimo_sueldo}}</td>
                <td>{{(int) $empleado->periodos[0]['importe'] ?? ''}}</td>
                <td>{{(int) $empleado->periodos[1]['importe'] ?? ''}}</td>
                <td>{{(int) $empleado->periodos[2]['importe'] ?? ''}}</td>
                <td>{{(int) $empleado->periodos[3]['importe'] ?? ''}}</td>
                <td>{{(int) $empleado->periodos[4]['importe'] ?? ''}}</td>
                <td>{{(int) $empleado->periodos[5]['importe'] ?? ''}}</td>
            </tr>
        @endforeach


        </tbody>

    </table>


</div>

</body>
</html>
