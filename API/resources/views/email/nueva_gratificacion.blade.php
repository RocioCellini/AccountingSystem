
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
    Se solicita la revision de la siguiente Gratificacion Especial
</p>

<table>
    <tr>
        <td><strong>Gerencia</strong></td>
        <td>{{$empleado->Padre->nombre_apellido ?? ''}}</td>
    </tr>

    <tr>
        <td><strong>Nombre</strong></td>
        <td>{{$empleado->nombre_apellido}}</td>
    </tr>
    <tr>
        <td><strong>Puesto</strong></td>
        <td>{{$empleado->titulo_puesto}}</td>
    </tr>
    <tr>
        <td><strong>Importe</strong></td>
        <td>$ {{ number_format($gratificacion->importe,0,",",".") }}</td>
    </tr>

    <tr>
        <td><strong>Periodo</strong></td>
        <td>{{ \Carbon\Carbon::parse($gratificacion->fecha)->format("Y-m") }}</td>
    </tr>



</table>

<p>
    Para aprobarlas por favor ingrese a <a href="{{env('URL_FRONT').'/novedades'}}"> {{env('URL_FRONT').'/novedades'}} </a>
</p>
</body>
</html>
