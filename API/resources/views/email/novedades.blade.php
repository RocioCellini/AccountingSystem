
<!doctype html>
<html lang="es">
<head>
    <style>
        body, p, div {
            color: #444444;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 15px;
        }

        .text-secondary {
            color: #e8166f !important;
        }

        p.chica		{ font-size: 12px; }
    </style>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
</head>

<body>

<div style="width: 100%;">
    <div style="width: 200px;float: right;">
        <img src="edge.svg"  style="width:250px; height: 100px;  object-fit: contain; float:right;" >
        <div style="clear:both;"></div>
    </div>
    <div style="clear:both;"></div>
</div>


<p>
    Hay novedades en Accounting System que aguardan su aprobacion
    <br>
    <a href="{{env('URL_FRONT')}}"> Ingresar a Accounting System </a>

</p>
<br>

@if(count($altas)>0)
    <h3>Altas</h3>
    <br>
    <table>
        <tr style="background-color: #2d3748; color:white;">
            <td style="padding-left: 3px;padding-right:3px;">Id</td>
            <td style="padding-left: 3px;padding-right:3px;">Gerente</td>
            <td style="padding-left: 3px;padding-right:3px;">Nombre</td>
            <td style="padding-left: 3px;padding-right:3px;">Apellido</td>
            <td style="padding-left: 3px;padding-right:3px;">Sector</td>
            <td style="padding-left: 3px;padding-right:3px;">Sueldo Bruto</td>
            <td style="padding-left: 3px;padding-right:3px;">Fecha Ingreso</td>
        </tr>
        @foreach($altas as $dt)
            <tr>
                <td style="padding: 1.2px">{{$dt->id}}</td>
                <td style="padding: 1.2px">{{$dt->Padre->nombre_apellido ?? ''}}</td>
                <td style="padding: 1.2px">{{$dt->nombre}}</td>
                <td style="padding: 1.2px">{{$dt->apellido}}</td>
                <td style="padding: 1.2px">{{$dt->Sector->descripcion ?? ''}}</td>
                <td style="padding: 1.2px;text-align: right">{{number_format($dt->sueldo_bruto,0,",",".")}}</td>
                <td style="padding: 1.2px">{{\Carbon\Carbon::parse($dt->fecha_ingreso)->format("d/m/Y")}}</td>
            </tr>
        @endforeach
    </table>
@endif



@if(count($incrementos)>0)
    <br>
    <h3>Incrementos de Sueldo</h3>
    <br>
    <table>
        <tr style="background-color: #2d3748; color:white;">
            <td style="padding-left: 3px;padding-right:3px;">Id</td>
            <td style="padding-left: 3px;padding-right:3px;">Gerente</td>
            <td style="padding-left: 3px;padding-right:3px;">Nombre Completo</td>
            <td style="padding-left: 3px;padding-right:3px;">Sector</td>
            <td style="padding-left: 3px;padding-right:3px;">Periodo</td>
            <td style="padding-left: 3px;padding-right:3px;">Incremento</td>
            <td style="padding-left: 3px;padding-right:3px;">Nuevo Sueldo</td>
        </tr>
        @foreach($incrementos as $dt)
            <tr>
                <td style="padding: 1.2px">{{$dt->id}}</td>
                <td style="padding: 1.2px">{{$dt->PropuestoPor->name ?? ''}}</td>
                <td style="padding: 1.2px">{{$dt->Empleado->nombre_apellido ?? ''}}</td>
                <td style="padding: 1.2px">{{$dt->Empleado->Sector->descripcion ?? ''}}</td>
                <td style="padding: 1.2px">{{$dt->periodo ?? ''}}</td>
                <td style="padding: 1.2px;text-align: right">{{number_format($dt->variacion,0,",",".")}}%</td>
                <td style="padding: 1.2px;text-align: right">{{number_format($dt->sueldo_bruto,0,",",".")}}</td>
            </tr>
        @endforeach
    </table>
@endif



@if(count($horasExtras)>0)
    <br>
    <h3>Horas Extras</h3>
    <br>
    <table>
        <tr style="background-color: #2d3748; color:white;">
            <td style="padding-left: 3px;padding-right:3px;">Id</td>
            <td style="padding-left: 3px;padding-right:3px;">Gerente</td>
            <td style="padding-left: 3px;padding-right:3px;">Nombre Completo</td>
            <td style="padding-left: 3px;padding-right:3px;">Sector</td>
            <td style="padding-left: 3px;padding-right:3px;">Periodo</td>
            <td style="padding-left: 3px;padding-right:3px;">Cantidad 50%</td>
            <td style="padding-left: 3px;padding-right:3px;">Cantidad 100%</td>
        </tr>
        @foreach($horasExtras as $dt)
            <tr>
                <td style="padding: 1.2px">{{$dt->id}}</td>
                <td style="padding: 1.2px">{{$dt->PropuestoPor->name ?? ''}}</td>
                <td style="padding: 1.2px">{{$dt->Empleado->nombre_apellido ?? ''}}</td>
                <td style="padding: 1.2px">{{$dt->Empleado->Sector->descripcion ?? ''}}</td>
                <td style="padding: 1.2px">{{$dt->periodo ?? ''}}</td>
                <td style="padding: 1.2px;text-align: right">{{number_format($dt->horas_extras_50,2,",",".")}}</td>
                <td style="padding: 1.2px;text-align: right">{{number_format($dt->horas_extras_100,2,",",".")}}</td>
            </tr>
        @endforeach
    </table>
@endif



@if(count($bonosSemestrales)>0)
    <br>
    <h3>Bono Semestral</h3>
    <br>
    <table>
        <tr style="background-color: #2d3748; color:white;">
            <td style="padding-left: 3px;padding-right:3px;">Id</td>
            <td style="padding-left: 3px;padding-right:3px;">Nombre Completo</td>
            <td style="padding-left: 3px;padding-right:3px;">Periodo</td>
            <td style="padding-left: 3px;padding-right:3px;">Importe</td>
        </tr>
        @foreach($bonosSemestrales as $dt)
            <tr>
                <td style="padding: 1.2px">{{$dt->Empleado->legajo_bejerman}}</td>
                <td style="padding: 1.2px">{{$dt->Empleado->nombre_apellido ?? ''}}</td>
                <td style="padding: 1.2px">{{$dt->periodo ?? ''}}</td>
                <td style="padding: 1.2px;text-align: right">{{number_format($dt->importe,2,",",".")}}</td>
            </tr>
        @endforeach
    </table>
@endif



@if(count($bonosTrimestrales)>0)
    <br>
    <h3>Bono Trimestral</h3>
    <br>
    <table>
        <tr style="background-color: #2d3748; color:white;">
            <td style="padding-left: 3px;padding-right:3px;">Id</td>
            <td style="padding-left: 3px;padding-right:3px;">Nombre Completo</td>
            <td style="padding-left: 3px;padding-right:3px;">Periodo</td>
            <td style="padding-left: 3px;padding-right:3px;">Importe</td>
        </tr>
        @foreach($bonosTrimestrales as $dt)
            <tr>
                <td style="padding: 1.2px">{{$dt->Empleado->legajo_bejerman}}</td>
                <td style="padding: 1.2px">{{$dt->Empleado->nombre_apellido ?? ''}}</td>
                <td style="padding: 1.2px">{{$dt->periodo ?? ''}}</td>
                <td style="padding: 1.2px;text-align: right">{{number_format($dt->importe,2,",",".")}}</td>
            </tr>
        @endforeach
    </table>
@endif



@if(count($gratificaciones)>0)
    <br>
    <h3>Gratificaciones</h3>
    <br>
    <table>
        <tr style="background-color: #2d3748; color:white;">
            <td style="padding-left: 3px;padding-right:3px;">Id</td>
            <td style="padding-left: 3px;padding-right:3px;">Nombre Completo</td>
            <td style="padding-left: 3px;padding-right:3px;">Periodo</td>
            <td style="padding-left: 3px;padding-right:3px;">Importe</td>
        </tr>
        @foreach($gratificaciones as $dt)
            <tr>
                <td style="padding: 1.2px">{{$dt->Empleado->legajo_bejerman}}</td>
                <td style="padding: 1.2px">{{$dt->Empleado->nombre_apellido ?? ''}}</td>
                <td style="padding: 1.2px">{{$dt->periodo ?? ''}}</td>
                <td style="padding: 1.2px;text-align: right">{{number_format($dt->importe,2,",",".")}}</td>
            </tr>
        @endforeach
    </table>
@endif



@if(count($comisiones )>0)
    <br>
    <h3>Comisiones</h3>
    <br>
    <table>
        <tr style="background-color: #2d3748; color:white;">
            <td style="padding-left: 3px;padding-right:3px;">Id</td>
            <td style="padding-left: 3px;padding-right:3px;">Nombre Completo</td>
            <td style="padding-left: 3px;padding-right:3px;">Periodo</td>
            <td style="padding-left: 3px;padding-right:3px;">Importe</td>
        </tr>
        @foreach($comisiones as $dt)
            <tr>
                <td style="padding: 1.2px">{{$dt->Empleado->legajo_bejerman}}</td>
                <td style="padding: 1.2px">{{$dt->Empleado->nombre_apellido ?? ''}}</td>
                <td style="padding: 1.2px">{{$dt->periodo ?? ''}}</td>
                <td style="padding: 1.2px;text-align: right">{{number_format($dt->importe,2,",",".")}}</td>
            </tr>
        @endforeach
    </table>
@endif

</body>
</html>
