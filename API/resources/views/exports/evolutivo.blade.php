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
            <td style="background-color: black; color:white">Gerente</td>
            <td style="background-color: black; color:white">Legajo</td>
            <td style="background-color: black; color:white">Nombre</td>
            <td style="background-color: black; color:white">DNI</td>
            <td style="background-color: black; color:white">Fecha Ingreso</td>
            <td style="background-color: black; color:white">Sector</td>
            <td style="background-color: black; color:white">Empresa</td>
            <td style="background-color: black; color:white">Puesto</td>
            <td style="background-color: black; color:white">Periodo</td>

            <td style="background-color: black; color:white">Sueldo Bruto</td>
            @if($detalleAprobadores)
                <td style="background-color: black; color:white">Aprobador</td>
                <td style="background-color: black; color:white">Fecha</td>
            @endif

            <td style="background-color: black; color:white">Horas Extras 50%</td>
            <td style="background-color: black; color:white">Horas Extras 100%</td>
            @if($detalleAprobadores)
                <td style="background-color: black; color:white">Aprobador</td>
                <td style="background-color: black; color:white">Fecha</td>
            @endif

            <td style="background-color: black; color:white">Comisiones</td>
            @if($detalleAprobadores)
                <td style="background-color: black; color:white">Aprobador</td>
                <td style="background-color: black; color:white">Fecha</td>
            @endif

            <td style="background-color: black; color:white">Gratificacion Especial</td>
            @if($detalleAprobadores)
                <td style="background-color: black; color:white">Aprobador</td>
                <td style="background-color: black; color:white">Fecha</td>
            @endif

            <td style="background-color: black; color:white">Bono Trismestral USD</td>
            <td style="background-color: black; color:white">Bono Trismestral ARS</td>
            @if($detalleAprobadores)
                <td style="background-color: black; color:white">Aprobador</td>
                <td style="background-color: black; color:white">Fecha</td>
            @endif

            <td style="background-color: black; color:white">Bono Semestral</td>
            @if($detalleAprobadores)
                <td style="background-color: black; color:white">Aprobador</td>
                <td style="background-color: black; color:white">Fecha</td>
            @endif
        </tr>

        @foreach($data as $dt)
            <tr>
                <td>{{$dt['empleado_padre']['nombre_apellido'] ?? ''}}</td>
                <td>{{$dt['empleado_legajo'] ?? ''}}</td>
                <td>{{$dt['empleado_nombre']}}</td>
                <td>{{$dt['empleado_documento']}}</td>
                <td>{{$dt['empleado_fecha_ingreso']}}</td>
                <td>{{$dt['empleado_sector']['descripcion']}}</td>
                <td>{{$dt['empleado_empresa']['descripcion']}}</td>
                <td>{{$dt['empleado_puesto']['descripcion']}}</td>
                <td>{{\Carbon\Carbon::parse($dt['fecha_hasta'])->format("Ym") }}</td>

                <td style="border-left-color: black; border-left-width: 1px; border-left-style: solid">{{(int)$dt['sueldo_bruto']}}</td>
                @if($detalleAprobadores)
                    <td>{{$dt['sueldo_bruto_aprobacion']['name'] ?? ''}}</td>
                    <td>{{!isset($dt['sueldo_bruto_aprobacion_fecha']['incremento_fecha_aprobacion']) ? '' : \Carbon\Carbon::parse($dt['sueldo_bruto_aprobacion_fecha']['incremento_fecha_aprobacion'])->format("d/m/Y")}}</td>
                @endif

                <td>{{ $dt['horas_extras_50']}}</td>
                <td>{{ $dt['horas_extras_100']}}</td>
                @if($detalleAprobadores)
                    <td>{{$dt['horas_extras_aprobacion']['name'] ?? ''}}</td>
                    <td>{{!isset($dt['horas_extras_aprobacion_fecha']['horas_extras_fecha_aprobacion']) ? '' : \Carbon\Carbon::parse($dt['horas_extras_aprobacion_fecha']['horas_extras_fecha_aprobacion'])->format("d/m/Y")}}</td>
                @endif

                <td>{{(int)$dt['comision']}}</td>
                @if($detalleAprobadores)
                    <td>{{$dt['comision_aprobacion']['name'] ?? ''}}</td>
                    <td>{{!isset($dt['comision_aprobacion']['name']) ? '' : \Carbon\Carbon::parse($dt['comision_obj']['updated_at'])->format("d/m/Y")}}</td>
                @endif

                <td>{{(int)$dt['gratificacion']}}</td>
                @if($detalleAprobadores)
                    <td>{{$dt['gratificacion_aprobacion']['name'] ?? ''}}</td>
                    <td>{{!isset($dt['gratificacion_fecha']['name']) ? '' : \Carbon\Carbon::parse($dt['gratificacion_fecha']['fecha_aprobacion'])->format("d/m/Y")}}</td>
                @endif

                <td>{{(int)$dt['bono_trimestral_dolares']}}</td>
                <td>{{(int)$dt['bono_trimestral_pesos']}}</td>
                @if($detalleAprobadores)
                    <td>{{$dt['bono_trimestral_aprobacion']['name'] ?? ''}}</td>
                    <td>{{!isset($dt['bono_trimestral_aprobacion_fecha']['name']) ? '' : \Carbon\Carbon::parse($dt['bono_trimestral_aprobacion_fecha']['fecha_aprobacion'])->format("d/m/Y")}}</td>
                @endif

                <td>{{(int)$dt['bono_semestral']}}</td>
                @if($detalleAprobadores)
                    <td>{{$dt['bono_semestral_aprobacion']['name'] ?? ''}}</td>
                    <td>{{!isset($dt['bono_semestral_aprobacion_fecha']['created_at']) ? '' : \Carbon\Carbon::parse($dt['bono_semestral_aprobacion_fecha']['created_at'])->format("d/m/Y")}}</td>
                @endif
            </tr>
        @endforeach


        </tbody>

    </table>


</div>

</body>
</html>
