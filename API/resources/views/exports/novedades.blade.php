<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{$empresa->descripcion}}</title>
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
            <td></td>
            <td></td>
            <td></td>
            <td colspan="4" style="background-color: lightgray">{{$empresa->descripcion}}</td>
        </tr>

        <tr>
            <td></td>
            <td></td>
            <td></td>
            <td style="background-color: lightgray">Novedades</td>
            <td style="background-color: lightgray">{{$periodo}}</td>
            <td style="background-color: lightgray"></td>
            <td style="background-color: lightgray">Tipo de Cambio</td>
            <td style="background-color: lightgray">{{$tipoCambio}}</td>
        </tr>
        <tr>
            <td></td>
        </tr>
        <tr>
            <td></td>
            <td></td>
            <td></td>
            <td style="text-align: center; background-color:#a0cb93;">Conceptos BJ</td>
            <td style="text-align: center; background-color:#a0cb93;">100</td>
            <td style="text-align: center; background-color:#a0cb93;">205</td>
            @if($empresa->codigo=="GAS")
                <td style="text-align: center; background-color:#a0cb93;">209</td>
            @endif
            <td style="text-align: center; background-color:#a0cb93;">203</td>
            <td style="text-align: center; background-color:#a0cb93;">204</td>
            <td style="text-align: center; background-color:#a0cb93;">@if($empresa->codigo=="GAS") 277 @else 256 @endif</td>
            <td style="text-align: center; background-color:#a0cb93;">240</td>
            <td style="text-align: center; background-color:#a0cb93;">221</td>
            <td style="text-align: center; background-color:#a0cb93;">222</td>
            <td style="text-align: center; background-color:#a0cb93;">170</td>
            <td style="text-align: center; background-color:#a0cb93;">171</td>
            <td style="text-align: center; background-color:#a0cb93;">219</td>
            <td style="text-align: center; background-color:#a0cb93;">499</td>
            <td style="text-align: center; background-color:#a0cb93;">280</td>
            @if($empresa->codigo!="GAS")
                <td style="text-align: center; background-color:#a0cb93;">209</td>
            @endif
            <td></td>
        </tr>


        <tr>
            <td></td>
            <td  style="text-align: center; background-color:#ffd300;">Leg.</td>
            <td  style="text-align: center; background-color:#ffd300;">F. ingreso</td>
            <td  style="text-align: center; background-color:#ffd300;">Nomina</td>
            <td  style="text-align: center; background-color:#ffd300;">Sueldos</td>
            <td  style="text-align: center; background-color:#ffd300;">Comisiones</td>
            @if($empresa->codigo=="GAS")
                <td  style="text-align: center; background-color:#ffd300;">Bono Mensual</td>
            @endif
            <td  style="text-align: center; background-color:#ffd300;">Bonus Trim.</td>
            <td  style="text-align: center; background-color:#ffd300;">Bonus Sem.</td>
            <td  style="text-align: center; background-color:#ffd300;">Bonus No Rem.</td>
            <td  style="text-align: center; background-color:#ffd300;">Plus Vacacional</td>
            <td  style="text-align: center; background-color:#ffd300;">HE 50%</td>
            <td  style="text-align: center; background-color:#ffd300;">HE 100%</td>
            <td  style="text-align: center; background-color:#ffd300;">Aj.p.gcia</td>
            <td  style="text-align: center; background-color:#ffd300;">Osde p gcia</td>
            <td  style="text-align: center; background-color:#ffd300;">Bonus Pluriemp.</td>
            <td  style="text-align: center; background-color:#ffd300;">Adelanto</td>
            <td  style="text-align: center; background-color:#ffd300;">Gratif. Extraord.</td>
            <td  style="text-align: center; background-color:#ffd300;">Bono Mensual</td>
            @if($empresa->codigo!="GAS")
                <td  style="text-align: center; background-color:#ffd300;">Prestamo</td>
            @endif
        </tr>

        @foreach($empleados as $empleado)
            <tr>
                <td>Registro:</td>
                <td>{{$empleado->legajo_bejerman}}</td>
                <td>{{$empleado->fecha_ingreso}}</td>
                <td>{{$empleado->nombre_apellido}}</td>
                <td>{{(int) $empleado->sueldo_bruto}}</td>
                <td>{{(int) $empleado->comisiones}}</td>
                @if($empresa->codigo=="GAS")
                    <td>{{(int) $empleado->bono_mensual ?? 0}}</td>
                @endif
                <td>{{(int) $empleado->bono_trimestral}}</td>
                <td>{{(int) $empleado->bono_semestral}}</td>
                <td>{{(int) $empleado->no_remunerativo}}</td>
                <td></td>
                <td>{{$empleado->horas_extras_50}}</td>
                <td>{{$empleado->horas_extras_100}}</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>{{(int) $empleado->gratificacion_especial ?? 0}}</td>
                @if($empresa->codigo!="GAS")
                    <td>{{(int) $empleado->bono_mensual ?? 0}}</td>
                @endif
                <td></td>
            </tr>
        @endforeach


        </tbody>

    </table>


</div>

</body>
</html>
