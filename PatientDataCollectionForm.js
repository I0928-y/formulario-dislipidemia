function PatientDataCollectionForm() {
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertCircle, Save } from 'lucide-react';

/**
 * PatientDataCollectionForm – versión ampliada
 * Incluye todas las variables del protocolo: escalas de riesgo, intervenciones y complicaciones no‑cardiovasculares.
 */
const PatientDataCollectionForm = () => {
  /* ----------------------------- STATE ----------------------------- */
  const [formData, setFormData] = useState({
    // Identificación
    expediente: '',
    folio: '',
    fechaRecoleccion: new Date().toISOString().split('T')[0],
    recolector: '',

    // Demográficos
    edad: '',
    sexo: '',
    peso: '',
    talla: '',
    imc: '',

    // Hospitalización
    fechaIngreso: '',
    fechaEgreso: '',
    servicio: 'Medicina Interna',

    // Diagnóstico
    diagnosticoPrincipal: '',
    diagnosticoOtro: '',

    // Perfil lipídico
    colesterolTotal: '',
    ldl: '',
    hdl: '',
    trigliceridos: '',
    perfilNoDisponible: {
      colesterolTotal: false,
      ldl: false,
      hdl: false,
      trigliceridos: false,
    },
    tiposDislipidemia: [],

    // Comorbilidades
    comorbilidades: [],
    estadioERC: '',

    // Tratamientos
    tratamientoPrevio: false,
    estatinaPrevia: '',
    estatinaPreviaDosis: '',
    tratamientoHospitalario: false,
    estatinaHospital: '',
    estatinaHospitalDosis: '',
    estatinaHospitalDias: '',

    // Escalas de riesgo
    graceScore: '',
    timiScore: '',
    killipKimball: '',
    nyha: '',

    // Intervenciones
    intervencionCateterismo: false,
    fechaCateterismo: '',
    intervencionAngioplastia: false,
    fechaAngioplastia: '',
    numeroVasos: '',
    intervencionCABG: false,
    fechaCirugia: '',
    marcapasoTemporal: false,
    fechaMarcapasoTemp: '',
    marcapasoDef: false,
    fechaMarcapasoDef: '',

    // Desenlaces
    mortalidad: false,
    fechaMortalidad: '',
    horaMortalidad: '',
    causaMortalidad: '',
    estanciaUCI: false,
    fechaIngresoUCI: '',
    fechaEgresoUCI: '',
    diasUCI: '',
    diasTotales: '',
    complicacionesCV: [],
    complicacionesNoCV: [],
    tipoInfeccion: [],
    observaciones: '',

    // Verificación
    datosCompletos: false,
    expedienteRevisado: false,
  });

  /* ----------------------------- EFFECTS --------------------------- */
  // IMC
  useEffect(() => {
    const peso = parseFloat(formData.peso);
    const talla = parseFloat(formData.talla);
    if (!isNaN(peso) && !isNaN(talla) && talla > 0) {
      setFormData((prev) => ({ ...prev, imc: (peso / (talla * talla)).toFixed(2) }));
    }
  }, [formData.peso, formData.talla]);

  // Dislipidemia automática
  useEffect(() => {
    const tipos: string[] = [];
    const { colesterolTotal, ldl, hdl, trigliceridos, sexo } = formData;
    const ct = parseFloat(colesterolTotal);
    const l = parseFloat(ldl);
    const h = parseFloat(hdl);
    const tg = parseFloat(trigliceridos);
    if (!isNaN(ct) && ct > 200) tipos.push('hipercolesterolemia');
    if (!isNaN(l) && l > 130) tipos.push('hipercolesterolemia');
    if (!isNaN(tg) && tg > 150) tipos.push('hipertrigliceridemia');
    if (!isNaN(h) && ((sexo === 'masculino' && h < 40) || (sexo === 'femenino' && h < 50))) tipos.push('hdlBajo');
    if (tipos.length > 1) tipos.push('dislipidemiaMixta');
    setFormData((prev) => ({ ...prev, tiposDislipidemia: tipos }));
  }, [formData.colesterolTotal, formData.ldl, formData.hdl, formData.trigliceridos, formData.sexo]);

  /* ----------------------------- HELPERS --------------------------- */
  const handleInputChange = (field: string, value: any) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleCheckboxToggle = (field: string, checked: boolean) => setFormData((prev) => ({ ...prev, [field]: checked }));

  const handleArrayCheckbox = (field: string, value: string, checked: boolean) =>
    setFormData((prev) => {
      const current = prev[field] || [];
      return { ...prev, [field]: checked ? [...current, value] : current.filter((v: string) => v !== value) };
    });

  const handleSubmit = () => {
    console.log('Datos formulario →', formData);
    alert('Datos guardados');
  };

  /* -------------------------- CONSTANTES -------------------------- */
  const DIAGNOSTICOS = [
    { value: 'iamcest', label: 'IAM con elevación ST' },
    { value: 'iamsest', label: 'IAM sin elevación ST' },
    { value: 'angina', label: 'Angina inestable' },
    { value: 'ic', label: 'Insuficiencia cardiaca descompensada' },
    { value: 'arritmia', label: 'Arritmia cardiaca' },
    { value: 'otro', label: 'Otro' },
  ];

  const COMORBILIDADES = [
    'Diabetes mellitus tipo 2',
    'Hipertensión arterial',
    'Enfermedad renal crónica',
    'EPOC',
    'Obesidad',
    'Dislipidemia conocida',
    'Cardiopatía isquémica previa',
  ];

  const COMPLICACIONES_CV = [
    'Reinfarto',
    'Insuficiencia cardiaca aguda',
    'Evento cerebrovascular',
    'Choque cardiogénico',
    'Taquicardia/Fibrilación ventricular',
  ];

  const COMPLICACIONES_NO_CV = [
    'Insuficiencia renal aguda',
    'Hemorragia mayor',
    'Neumonía',
    'Sepsis',
    'Tromboembolia pulmonar',
  ];

  const INFECCIONES = ['ITU', 'Neumonía', 'Bacteriemia', 'Herida quirúrgica'];

  /* ----------------------------- RENDER --------------------------- */
  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Cuestionario de Recolección de Datos</CardTitle>
          <p className="text-center text-gray-600">Protocolo Dislipidemia – Versión completa</p>
        </CardHeader>

        <CardContent>
          <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
            {/* IDENTIFICACIÓN */}
            <section>
              <h2 className="text-lg font-semibold mb-4">Identificación</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'expediente', label: 'N.º de expediente' },
                  { id: 'folio', label: 'Folio estudio' },
                  { id: 'fechaRecoleccion', label: 'Fecha recolección', type: 'date' },
                  { id: 'recolector', label: 'Recolector' },
                ].map(({ id, label, type }) => (
                  <div key={id}>
                    <Label>{label}</Label>
                    <Input type={type || 'text'} value={formData[id]} onChange={(e) => handleInputChange(id, e.target.value)} />
                  </div>
                ))}
              </div>
            </section>

            {/* DEMOGRÁFICOS */}
            <section>
              <h2 className="text-lg font-semibold mb-4">Datos demográficos</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Edad (años)</Label>
                  <Input type="number" value={formData.edad} onChange={(e) => handleInputChange('edad', e.target.value)} />
                </div>
                <div>
                  <Label>Sexo</Label>
                  <Select value={formData.sexo} onValueChange={(val) => handleInputChange('sexo', val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="masculino">Masculino</SelectItem>
                      <SelectItem value="femenino">Femenino</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Peso (kg)</Label>
                  <Input type="number" step="0.1" value={formData.peso} onChange={(e) => handleInputChange('peso', e.target.value)} />
                </div>
                <div>
                  <Label>Talla (m)</Label>
                  <Input type="number" step="0.01" value={formData.talla} onChange={(e) => handleInputChange('talla', e.target.value)} />
                </div>
                <div>
                  <Label>IMC</Label>
                  <Input type="number" value={formData.imc} readOnly className="bg-gray-100" />
                </div>
              </div>
              {/* COMORBILIDADES */}
              <div className="mt-6">
                <Label className="font-semibold">Comorbilidades</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {COMORBILIDADES.map((c) => (
                    <div key={c} className="flex items-center space-x-2">
                      <Checkbox checked={formData.comorbilidades.includes(c)} onCheckedChange={(chk) => handleArrayCheckbox('comorbilidades', c, chk)} />
                      <Label>{c}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* DIAGNÓSTICO + PERFIL LIPÍDICO */}
            <section>
              <h2 className="text-lg font-semibold mb-4">Diagnóstico y Perfil lipídico</h2>
              <div className="mb-4">
                <Label>Diagnóstico principal</Label>
                <Select value={formData.diagnosticoPrincipal} onValueChange={(val) => handleInputChange('diagnosticoPrincipal', val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione diagnóstico" />
                  </SelectTrigger>
                  <SelectContent>
                    {DIAGNOSTICOS.map((d) => (<SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              {/* Perfil lipídico grid */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { field: 'colesterolTotal', label: 'Colesterol total' },
                  { field: 'ldl', label: 'LDL' },
                  { field: 'hdl', label: 'HDL' },
                  { field: 'trigliceridos', label: 'Triglicéridos' },
                ].map(({ field, label }) => (
                  <div key={field} className="flex items-center space-x-2">
                    <div className="flex-1">
                      <Label>{label} (mg/dL)</Label>
                      <Input type="number" value={formData[field]} onChange={(e) => handleInputChange(field, e.target.value)} disabled={formData.perfilNoDisponible[field]} />
                    </div>
                    <Checkbox checked={formData.perfilNoDisponible[field]} onCheckedChange={(chk) => setFormData((prev) => ({ ...prev, perfilNoDisponible: { ...prev.perfilNoDisponible, [field]: chk } }))} />
                    <Label>ND</Label>
                  </div>
                ))}
              </div>
              {formData.tiposDislipidemia.length > 0 && (
                <Alert className="mt-4"><AlertCircle className="h-4 w-4" /><AlertDescription>Dislipidemias: {formData.tiposDislipidemia.join(', ')}</AlertDescription></Alert>
              )}
            </section>

            {/* ESCALAS */}
            <section>
              <h2 className="text-lg font-semibold mb-4">Escalas pronósticas</h2>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { id: 'graceScore', label: 'GRACE' },
                  { id: 'timiScore', label: 'TIMI' },
                  { id: 'killipKimball', label: 'Killip–Kimball' },
                  { id: 'nyha', label: 'NYHA' },
                ].map(({ id, label }) => (
                  <div key={id}>
                    <Label>{label}</Label>
                    <Input type="number" value={formData[id]} onChange={(e) => handleInputChange(id, e.target.value)} />
                  </div>
                ))}
              </div>
            </section>

            {/* INTERVENCIONES */}
            <section>
              <h2 className="text-lg font-semibold mb-4">Intervenciones</h2>
              <div className="space-y-4">
                {/* Cateterismo */}
                <div className="flex items-center space-x-2">
                  <Checkbox checked={formData.intervencionCateterismo} onCheckedChange={(chk) => handleCheckboxToggle('intervencionCateterismo', chk)} />
                  <Label>Cateterismo diagnóstico</Label>
                  {formData.intervencionCateterismo && (
                    <Input type="date" className="ml-4" value={formData.fechaCateterismo} onChange={(e) => handleInputChange('fechaCateterismo', e.target.value)} />
                  )}
                </div>
                {/* Angioplastia */}
                <div className="flex items-center space-x-2">
                  <Checkbox checked={formData.intervencionAngioplastia} onCheckedChange={(chk) => handleCheckboxToggle('intervencionAngioplastia', chk)} />
                  <Label>Angioplastia (PCI)</Label>
                  {formData.intervencionAngioplastia && (
                    <>
                      <Input type="date" className="ml-4" value={formData.fechaAngioplastia} onChange={(e) => handleInputChange('fechaAngioplastia', e.target.value)} />
                      <Input type="number" className="ml-2 w-20" placeholder="# vasos" value={formData.numeroVasos} onChange={(e) => handleInputChange('numeroVasos', e.target.value)} />
                    </>
                  )}
                </div>
                {/* Cirugía CABG */}
                <div className="flex items-center space-x-2">
                  <Checkbox checked={formData.intervencionCABG} onCheckedChange={(chk) => handleCheckboxToggle('intervencionCABG', chk)} />
                  <Label>Cirugía de revascularización (CABG)</Label>
                  {formData.intervencionCABG && <Input type="date" className="ml-4" value={formData.fechaCirugia} onChange={(e) => handleInputChange('fechaCirugia', e.target.value)} />}
                </div>
                {/* Marcapasos temporal */}
                <div className="flex items-center space-x-2">
                  <Checkbox checked={formData.marcapasoTemporal} onCheckedChange={(chk) => handleCheckboxToggle('marcapasoTemporal', chk)} />
                  <Label>Marcapaso temporal</Label>
                  {formData.marcapasoTemporal && <Input type="date" className="ml-4" value={formData.fechaMarcapasoTemp} onChange={(e) => handleInputChange('fechaMarcapasoTemp', e.target.value)} />}
                </div>
                {/* Marcapaso definitivo */}
                <div className="flex items-center space-x-2">
                  <Checkbox checked={formData.marcapasoDef} onCheckedChange={(chk) => handleCheckboxToggle('marcapasoDef', chk)} />
                  <Label>Marcapaso definitivo</Label>
                  {formData.marcapasoDef && <Input type="date" className="ml-4" value={formData.fechaMarcapasoDef} onChange={(e) => handleInputChange('fechaMarcapasoDef', e.target.value)} />}
                </div>
              </div>
            </section>

            {/* TRATAMIENTO HIPOLIPEMIANTE */}
            <section>
              <h2 className="text-lg font-semibold mb-4">Tratamiento hipolipemiante</h2>
              <div className="space-y-6">
                {/* Previo */}
                <div className="flex items-center space-x-2">
                  <Checkbox checked={formData.tratamientoPrevio} onCheckedChange={(chk) => handleCheckboxToggle('tratamientoPrevio', chk)} />
                  <Label>Recibía tratamiento previo</Label>
                </div>
                {formData.tratamientoPrevio && (
                  <div className="grid grid-cols-3 gap-4 border p-4 rounded">
                    <div><Label>Estatina</Label><Input value={formData.estatinaPrevia} onChange={(e) => handleInputChange('estatinaPrevia', e.target.value)} /></div>
                    <div><Label>Dosis (mg/d)</Label><Input type="number" value={formData.estatinaPreviaDosis} onChange={(e) => handleInputChange('estatinaPreviaDosis', e.target.value)} /></div>
                  </div>
                )}

                {/* Hospitalario */}
                <div className="flex items-center space-x-2">
                  <Checkbox checked={formData.tratamientoHospitalario} onCheckedChange={(chk) => handleCheckboxToggle('tratamientoHospitalario', chk)} />
                  <Label>Recibió tratamiento hospitalario</Label>
                </div>
                {formData.tratamientoHospitalario && (
                  <div className="grid grid-cols-3 gap-4 border p-4 rounded">
                    <div><Label>Estatina</Label><Input value={formData.estatinaHospital} onChange={(e) => handleInputChange('estatinaHospital', e.target.value)} /></div>
                    <div><Label>Dosis (mg/d)</Label><Input type="number" value={formData.estatinaHospitalDosis} onChange={(e) => handleInputChange('estatinaHospitalDosis', e.target.value)} /></div>
                    <div><Label>Días</Label><Input type="number" value={formData.estatinaHospitalDias} onChange={(e) => handleInputChange('estatinaHospitalDias', e.target.value)} /></div>
                  </div>
                )}
              </div>
            </section>

            {/* DESENLACES */}
            <section>
              <h2 className="text-lg font-semibold mb-4">Desenlaces</h2>
              {/* Mortalidad */}
              <div className="flex items-center space-x-2 mb-2">
                <Checkbox checked={formData.mortalidad} onCheckedChange={(chk) => handleCheckboxToggle('mortalidad', chk)} />
                <Label>Mortalidad intrahospitalaria</Label>
              </div>
              {formData.mortalidad && (
                <div className="grid grid-cols-3 gap-4 border p-4 rounded mb-4">
                  {[
                    { id: 'fechaMortalidad', label: 'Fecha', type: 'date' },
                    { id: 'horaMortalidad', label: 'Hora', type: 'time' },
                    { id: 'causaMortalidad', label: 'Causa', type: 'text' },
                  ].map(({ id, label, type }) => (
                    <div key={id}><Label>{label}</Label><Input type={type} value={formData[id]} onChange={(e) => handleInputChange(id, e.target.value)} /></div>
                  ))}
                </div>
              )}

              {/* UCI */}
              <div className="flex items-center space-x-2 mb-2"><Checkbox checked={formData.estanciaUCI} onCheckedChange={(chk) => handleCheckboxToggle('estanciaUCI', chk)} /><Label>Ingreso a UCI</Label></div>
              {formData.estanciaUCI && (
                <div className="grid grid-cols-3 gap-4 border p-4 rounded mb-4">
                  <div><Label>Ingreso</Label><Input type="date" value={formData.fechaIngresoUCI} onChange={(e) => handleInputChange('fechaIngresoUCI', e.target.value)} /></div>
                  <div><Label>Egreso</Label><Input type="date" value={formData.fechaEgresoUCI} onChange={(e) => handleInputChange('fechaEgresoUCI', e.target.value)} /></div>
                  <div><Label>Días</Label><Input type="number" value={formData.diasUCI} onChange={(e) => handleInputChange('diasUCI', e.target.value)} /></div>
                </div>
              )}

              {/* Días estancia */}
              <div className="mb-4"><Label>Días totales hospitalización</Label><Input type="number" value={formData.diasTotales} onChange={(e) => handleInputChange('diasTotales', e.target.value)} /></div>

              {/* Complicaciones */}
              <div className="mb-4">
                <Label className="font-semibold">Complicaciones cardiovasculares</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {COMPLICACIONES_CV.map((c) => (
                    <div key={c} className="flex items-center space-x-2"><Checkbox checked={formData.complicacionesCV.includes(c)} onCheckedChange={(chk) => handleArrayCheckbox('complicacionesCV', c, chk)} /><Label>{c}</Label></div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <Label className="font-semibold">Complicaciones no cardiovasculares</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {COMPLICACIONES_NO_CV.map((c) => (
                    <div key={c} className="flex items-center space-x-2"><Checkbox checked={formData.complicacionesNoCV.includes(c)} onCheckedChange={(chk) => handleArrayCheckbox('complicacionesNoCV', c, chk)} /><Label>{c}</Label></div>
                  ))}
                </div>
              </div>

              {/* Infecciones específicas */}
              <div className="mb-4">
                <Label className="font-semibold">Tipo de infección</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {INFECCIONES.map((inf) => (
                    <div key={inf} className="flex items-center space-x-2"><Checkbox checked={formData.tipoInfeccion.includes(inf)} onCheckedChange={(chk) => handleArrayCheckbox('tipoInfeccion', inf, chk)} /><Label>{inf}</Label></div>
                  ))}
                </div>
              </div>

              <div className="mb-4"><Label>Observaciones</Label><textarea className="w-full border rounded p-2" rows={3} value={formData.observaciones} onChange={(e) => handleInputChange('observaciones', e.target.value)} /></div>

              <div className="border rounded p-4 bg-gray-50 space-y-2">
                <div className="flex items-center space-x-2"><Checkbox checked={formData.datosCompletos} onCheckedChange={(chk) => handleCheckboxToggle('datosCompletos', chk)} /><Label>Datos completos</Label></div>
                <div className="flex items-center space-x-2"><Checkbox checked={formData.expedienteRevisado} onCheckedChange={(chk) => handleCheckboxToggle('expedienteRevisado', chk)} /><Label>Expediente revisado</Label></div>
              </div>
            </section>

            {/* BOTONES */}
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline">Guardar borrador</Button>
              <Button type="button" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSubmit}><Save className="h-4 w-4 mr-2" /> Guardar datos</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
