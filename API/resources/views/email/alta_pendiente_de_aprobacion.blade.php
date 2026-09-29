
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
    Se ingreso un nuevo alta sujeto a su aprobacion.......
</p>

<table>
    <tr>
        <td><strong>Gerencia</strong></td>
        <td>{{$alta->Padre->nombre_completo ?? ''}}</td>
    </tr>

    <tr>
        <td><strong>Nombre</strong></td>
        <td>{{$alta->nombre}}</td>
    </tr>

    <tr>
        <td><strong>Apellido</strong></td>
        <td>{{$alta->apellido}}</td>
    </tr>

    <tr>
        <td><strong>Documento</strong></td>
        <td>{{$alta->documento}}</td>
    </tr>

    <tr>
        <td><strong>Fecha Nacimiento</strong></td>
        <td>{{\Carbon\Carbon::parse($alta->fecha_nacimiento)->format("d/m/Y")}} ( {{ \Carbon\Carbon::parse($alta->fecha_nacimiento)->age}} ) </td>
    </tr>

    <tr>
        <td><strong>Puesto</strong></td>
        <td>{{$alta->titulo_puesto}}</td>
    </tr>

    <tr>
        <td><strong>Fecha Nacimiento</strong></td>
        <td>{{\Carbon\Carbon::parse($alta->fecha_ingreso)->format("d/m/Y") }}</td>
    </tr>

    <tr>
        <td><strong>Sueldo Bruto</strong></td>
        <td>$ {{ number_format($alta->sueldo_bruto,0,",",".") }}</td>
    </tr>

    <tr>
        <td><strong>Bono Semestral</strong></td>
        <td>{{ number_format($alta->bono_semestral,0,",",".") }} Sueldos</td>
    </tr>

    <tr>
        <td><strong>Dias Vacaciones</strong></td>
        <td>{{ number_format($alta->dias_vacaciones,0,",",".") }} Dias</td>
    </tr>

    <tr>
        <td><strong>Plan osde</strong></td>
        <td>{{$alta->plan_osde}}</td>
    </tr>

    <tr>
        <td><strong>Empresa</strong></td>
        <td>{{ $alta->Empresa->descripcion }}</td>
    </tr>


</table>

<p>
    Para aprobarlas por favor ingrese a <a href="{{env('URL_FRONT').'/altas'}}"> {{env('URL_FRONT').'/altas'}} </a>
</p>
</body>
</html>
