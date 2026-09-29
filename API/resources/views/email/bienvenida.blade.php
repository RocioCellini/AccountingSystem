
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
    <span style="font-size: 24px; font-weight: bold;">
        HOLA {{$user->name}}
    </span>

    <br><br><br>

    Te damos la bienvenida al nuevo sitio donde podrás administrar tus recursos, nuevas altas, informar novedades al equipo de RRHH y todo lo que necesites, para esto te invitamos a que ingreses.
    <br><br>
    Usuario: {{$user->email}}
    <br>
    Contraseña temporal: {{$password}}
    <br><br>
    Al ingresar podrás cambiar la misma.
    <br><br>
    <a href="{{env('URL_FRONT')}}"> Iniciar registro </a>

</p>

</body>
</html>
