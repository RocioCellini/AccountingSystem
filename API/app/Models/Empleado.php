<?php

namespace App\Models;

use App\Http\Controllers\ConfiguracionesController;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class Empleado extends Model
{
    use HasFactory;

    protected $table = "empleados";

    protected $fillable = ['nombre_apellido','fecha_nacimiento','documento','plan_osde','titulo_puesto','fecha_ingreso','fecha_baja','sueldo_bruto','dias_vacaciones','bono_semestral','puesto_id','empresa_id','sector_id','padre_id','es_comercial','email','subsegmento_id','repite_bono_semestral','nunca_liquido_bonus','llave_distribucion_id','meses_reconocidos','tipo_empleado'];

    protected $appends = ['legajo_bejerman','legajo_sun','fecha_ingreso_formatted','fecha_baja_string','fecha_ingreso_string','fecha_nacimiento_string','ultimo_sueldo','es_baja','es_favorito','edad'];

    protected static function booted()
    {
        static::creating(function ($model) {
            $model->created_by = Auth::id();
        });

        static::updating(function ($model) {
            $model->updated_by = Auth::id();
        });
    }

    public function getFechaIngresoFormattedAttribute(){
        return Carbon::parse($this->fecha_ingreso)->format("d/m/Y");
    }

    public function getEsFavoritoAttribute(){
        return Favorito::whereEmpleadoId($this->id)->whereUserId(Auth::id())->exists();
    }


    public function getFechaIngresoStringAttribute(){
        return Carbon::parse($this->fecha_ingreso)->format("dmY");
    }

    public function getFechaNacimientoStringAttribute(){
        return Carbon::parse($this->fecha_nacimiento)->format("dmY");
    }


    public function getEdadAttribute(){
        return Carbon::parse($this->fecha_nacimiento)->age;
    }

    public function getFechaBajaStringAttribute(){
        return Carbon::parse($this->fecha_baja)->format("dmY");
    }

    public function Puesto(){
        return $this->belongsTo(Puesto::class,'puesto_id');
    }

    public function Empresa(){
        return $this->belongsTo(Empresa::class,'empresa_id');
    }

    public function Sector(){
        return $this->belongsTo(Sector::class,'sector_id');
    }

    public function Padre(){
        return $this->belongsTo(User::class,'padre_id');
    }

    public function Subsegmento(){
        return $this->belongsTo(SubSegmento::class,'subsegmento_id');
    }

    public function Legajos(){
        return $this->belongsToMany(Sistema::class, 'empleado_sistema', 'empleado_id', 'sistema_id')->withPivot('legajo');
    }

    public function Oficiales(){
        return $this->hasMany(EmpleadoOficial::class,'empleado_id');
    }

    public function Fondos(){
        return $this->hasMany(EmpleadoFondo::class,'empleado_id');
    }


    public function Cuotapartistas(){
        return $this->hasMany(EmpleadoCuotapartista::class,'empleado_id');
    }

    public function Archivos(){
        return $this->hasMany(Archivo::class,'empleado_id');
    }

    public function LlaveDistribucion(){
        return $this->belongsTo(LlaveDistribucion::class,'llave_distribucion_id');
    }


    public function getUltimoSueldoAttribute(){
        $fechaCierre = Carbon::parse(Parametro::whereCodigo('CIERRE')->value('valor_fecha'))->format("Y-m-d");
        $ultimoSueldo = Novedad::whereEmpleadoId($this->id)->whereDate('fecha','<=',$fechaCierre)->whereEstadoId(Estado::whereCodigo('APR')->value('id'))->orderBy('fecha','desc')->first();
        return $ultimoSueldo->sueldo_bruto ?? $this->sueldo_bruto;
    }

    public function getEsBajaAttribute(){
        return isset($this->fecha_baja);
    }

    public function getLegajoBejermanAttribute(){
        return DB::table('empleado_sistema')->whereEmpleadoId($this->id)->whereSistemaId(Sistema::whereCodigo('BJ')->value('id'))->value('legajo');
    }

    public function getLegajoSunAttribute(){
        return DB::table('empleado_sistema')->whereEmpleadoId($this->id)->whereSistemaId(Sistema::whereCodigo('SUN')->value('id'))->value('legajo');
    }

    public function getSueldo($periodo){
        $fechaCierre = Carbon::parse($periodo."01")->endOfMonth()->format("Y-m-d");
        $ultimoSueldo = Novedad::whereEmpleadoId($this->id)->whereDate('fecha','<=',$fechaCierre)->whereEstadoId(Estado::whereCodigo('APR')->value('id'))->orderBy('fecha','desc')->first();
        return $ultimoSueldo->sueldo_bruto ?? $this->sueldo_bruto;
    }

    public function getIngresos($periodo){
        $fechaCierre = Carbon::parse($periodo."01")->endOfMonth()->format("Y-m-d");
        $fechaInicio = Carbon::parse($periodo."01")->startOfMonth()->format("Y-m-d");
        $ultimoSueldo = Novedad::whereEmpleadoId($this->id)->whereDate('fecha','<=',$fechaCierre)->whereEstadoId(Estado::whereCodigo('APR')->value('id'))->orderBy('fecha','desc')->first();
        $sueldo =  $ultimoSueldo->sueldo_bruto ?? $this->sueldo_bruto;
        $bonoTrimestral = BonoTrimestralDistribucion::whereEmpleadoId($this->id)->whereEstadoId(Estado::whereCodigo('APR')->value('id'))->whereBetween('fecha',[$fechaInicio,$fechaCierre])->first();
        $bonoSemestral = BonoSemestral::whereEmpleadoId($this->id)->whereEstadoId(Estado::whereCodigo('APR')->value('id'))->whereBetween('fecha',[$fechaInicio,$fechaCierre])->first();
        $comision = Comision::whereEmpleadoId($this->id)->whereEstadoId(Estado::whereCodigo('APR')->value('id'))->whereBetween('fecha',[$fechaInicio,$fechaCierre])->first();
        $gratificacion = GratificacionEspecial::whereEmpleadoId($this->id)->whereEstadoId(Estado::whereCodigo('APR')->value('id'))->whereBetween('fecha',[$fechaInicio,$fechaCierre])->first();

        return $sueldo + $bonoTrimestral + $bonoSemestral + $comision + $gratificacion;


    }

    public function getGratificaciones($periodo){
        $fechaCierre = Carbon::parse($periodo."01")->endOfMonth()->format("Y-m-d");
        $fechaInicio = Carbon::parse($periodo."01")->startOfMonth()->format("Y-m-d");
        $bonoTrimestral = BonoTrimestralDistribucion::whereEmpleadoId($this->id)->whereEstadoId(Estado::whereCodigo('APR')->value('id'))->whereBetween('fecha',[$fechaInicio,$fechaCierre])->first();
        $bonoSemestral = BonoSemestral::whereEmpleadoId($this->id)->whereEstadoId(Estado::whereCodigo('APR')->value('id'))->whereBetween('fecha',[$fechaInicio,$fechaCierre])->first();
        $comision = Comision::whereEmpleadoId($this->id)->whereEstadoId(Estado::whereCodigo('APR')->value('id'))->whereBetween('fecha',[$fechaInicio,$fechaCierre])->first();
        $gratificacion = GratificacionEspecial::whereEmpleadoId($this->id)->whereEstadoId(Estado::whereCodigo('APR')->value('id'))->whereBetween('fecha',[$fechaInicio,$fechaCierre])->first();

        return $bonoTrimestral + $bonoSemestral + $comision + $gratificacion;


    }

    public function getDiasVacaciones($periodo = null){
        if(!isset($periodo)){
            Carbon::now()->format("Ym");
        }

        $antiguedad = Carbon::parse($this->fecha_ingreso)->diffInMonths(Carbon::parse($periodo."01")->endOfMonth())+1;
        $antiguedad += $this->meses_reconocidos;

        $antiguedad = floor($antiguedad/12);
        if($antiguedad<=5){
            return 14;
        } elseif($antiguedad<=10){
            return 21;
        }elseif($antiguedad<=20){
            return 28;
        } else {
            return 35;
        }

    }

}
