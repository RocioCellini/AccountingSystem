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
            <td style="background-color: #2d3748; color:#ffffff"> Clase </td>
            <td style="background-color: #2d3748; color:#ffffff"> NumCuotapartista </td>
            <td style="background-color: #2d3748; color:#ffffff"> Descripcion </td>
            <td style="background-color: #2d3748; color:#ffffff"> Oficial </td>
            <td style="background-color: #2d3748; color:#ffffff"> Generado </td>
            <td style="background-color: #2d3748; color:#ffffff"> Fondo </td>
        </tr>
        @foreach($data as $key => $dt)
            <tr>
                <td>{{$data[$key]->Abreviatura}}</td>
                <td>{{$data[$key]->NumCuotapartista}}</td>
                <td>{{$data[$key]->Nombre}}</td>
                <td>{{$data[$key]->Oficial}}</td>
                <td>{{$data[$key]->Generado}}</td>
                <td>{{$data[$key]->Fondo}}</td>
            </tr>
        @endforeach

        </tbody>

    </table>


</div>

</body>
</html>
