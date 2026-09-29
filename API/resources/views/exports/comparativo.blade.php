<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
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
            <td style="background-color: black; color:white">Nombre y Apellido</td>
            @foreach($data as $key => $dt)
                <td style="background-color: black; color:white">{{$data[$key]['nombre_apellido']}}</td>
            @endforeach
        </tr>
        <tr>
            <td>Legajo</td>
            @foreach($data as $key => $dt)
                <td style="text-align: left">{{$data[$key]['legajo_bejerman']}}</td>
            @endforeach
        </tr>

        <tr>
            <td>Empresa</td>
            @foreach($data as $key => $dt)
                <td style="">{{$data[$key]['empresa']['descripcion']}}</td>
            @endforeach
        </tr>

        <tr>
            <td>Sector</td>
            @foreach($data as $key => $dt)
                <td style="">{{$data[$key]['sector']['descripcion']}}</td>
            @endforeach
        </tr>

        <tr>
            <td>Sueldo Bruto</td>
            @foreach($data as $key => $dt)
                <td style="text-align: right">{{$data[$key]['ultimo_sueldo']}}</td>
            @endforeach
        </tr>

        <tr>
            <td>Plan Osde</td>
            @foreach($data as $key => $dt)
                <td style="text-align: left">{{$data[$key]['plan_osde']}}</td>
            @endforeach
        </tr>

        <tr>
            <td>Bono Semestral</td>
            @foreach($data as $key => $dt)
                <td style="text-align: right">{{$data[$key]['bono_semestral']}}</td>
            @endforeach
        </tr>




        </tbody>

    </table>


</div>

</body>
</html>
