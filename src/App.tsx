// Main App component - Medical Records Management System
// This component provides a complete medical records management interface
// with patient data storage via FastAPI backend and image upload capabilities

import { useState, useEffect, useRef } from 'react'
import { Button } from "./components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./components/ui/card"
import { Input } from "./components/ui/input"
import { Textarea } from "./components/ui/textarea"
import { Label } from "./components/ui/label"
import { Switch } from "./components/ui/switch"
import { Settings } from "./components/Settings"
import { AIDiagnosisViewer } from "./components/AIDiagnosisViewer"
import { Search, Plus, Trash2, Edit, User, ClipboardList, HeartPulse, Pill, FileText, Upload, Image as ImageIcon, WifiOff, Loader2, Settings as SettingsIcon, Sparkles } from "lucide-react"
import { apiService, PatientRecord } from './services/api'

export default function App() {
  const [records, setRecords] = useState<PatientRecord[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<PatientRecord | null>(null)
  const [isServerOnline, setIsServerOnline] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isAdvancedMode, setIsAdvancedMode] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isDiagnosisViewerOpen, setIsDiagnosisViewerOpen] = useState(false)
  const [aiDiagnosis, setAiDiagnosis] = useState<any>(null)
  const [isGeneratingDiagnosis, setIsGeneratingDiagnosis] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    historialClinico: '',
    antecedentes: '',
    sintomas: '',
    diagnosticos: '',
    tratamientos: '',
    notas: '',
    images: [] as string[],
    estudiosImagen: '',
    estudiosImagenFiles: [] as string[],
    pruebasComplementarias: '',
    pruebasComplementariasFiles: [] as string[],
    aiDiagnosis: undefined as any
  })

  // Check server health and load records on component mount
  useEffect(() => {
    checkServerAndLoadData()
    
    // Check server health every 5 seconds
    const interval = setInterval(checkServerHealth, 5000)
    return () => clearInterval(interval)
  }, [])

  const checkServerHealth = async () => {
    const isOnline = await apiService.checkHealth()
    setIsServerOnline(isOnline)
  }

  const checkServerAndLoadData = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const isOnline = await apiService.checkHealth()
      setIsServerOnline(isOnline)
      
      if (isOnline) {
        const patients = await apiService.getPatients()
        setRecords(patients)
      } else {
        setError('Servidor no disponible. Por favor inicie el servidor.')
      }
    } catch (err) {
      setError('Error al conectar con el servidor')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsLoading(true)
      setError(null)
      
      try {
        // Get temporary patient ID for uploads before saving
        const tempPatientId = currentRecord?.id || 'temp_' + Date.now()
        
        const uploadPromises = Array.from(e.target.files).map(file =>
          apiService.uploadImage(file, tempPatientId)
        )
        
        const uploadedImages = await Promise.all(uploadPromises)
        
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...uploadedImages.map(img => img.path)]
        }))
      } catch (err) {
        setError('Error al subir imágenes')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const removeImage = async (index: number) => {
    const imageToRemove = formData.images[index]
    const filename = imageToRemove.split('/').pop()
    
    if (filename) {
      try {
        await apiService.deleteImage(filename)
      } catch (err) {
        console.error('Error al eliminar imagen:', err)
      }
    }
    
    const newImages = [...formData.images]
    newImages.splice(index, 1)
    setFormData(prev => ({
      ...prev,
      images: newImages
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      const patientData = {
        ...formData,
        aiDiagnosis: aiDiagnosis || undefined
      }
      
      if (isEditing && currentRecord) {
        // Update existing record
        const updated = await apiService.updatePatient(currentRecord.id, patientData)
        setRecords(records.map(record => 
          record.id === currentRecord.id ? updated : record
        ))
      } else {
        // Create new record
        const newRecord = await apiService.createPatient(patientData)
        setRecords([newRecord, ...records])
      }
      
      resetForm()
      setIsFormOpen(false)
    } catch (err) {
      setError('Error al guardar el registro')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateAIDiagnosis = async () => {
    setIsGeneratingDiagnosis(true)
    setError(null)
    
    try {
      const diagnosisData = {
        age: formData.age,
        gender: formData.gender,
        historialClinico: formData.historialClinico,
        antecedentes: formData.antecedentes,
        sintomas: formData.sintomas,
        diagnosticos: formData.diagnosticos,
        notas: formData.notas,
        estudiosImagen: formData.estudiosImagen,
        pruebasComplementarias: formData.pruebasComplementarias
      }
      
      const response = await fetch('http://localhost:5847/api/ai/diagnosis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(diagnosisData)
      })
      
      if (!response.ok) {
        throw new Error('Error al generar diagnóstico')
      }
      
      const result = await response.json()
      setAiDiagnosis(result)
      
      // Actualizar el formData con el diagnóstico de IA
      setFormData(prev => ({
        ...prev,
        aiDiagnosis: result
      }))
      
      setIsDiagnosisViewerOpen(true)
    } catch (err) {
      setError('Error al generar diagnóstico por IA. Verifique su API Key en ajustes.')
      console.error(err)
    } finally {
      setIsGeneratingDiagnosis(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      age: '',
      gender: '',
      historialClinico: '',
      antecedentes: '',
      sintomas: '',
      diagnosticos: '',
      tratamientos: '',
      notas: '',
      images: [],
      estudiosImagen: '',
      estudiosImagenFiles: [],
      pruebasComplementarias: '',
      pruebasComplementariasFiles: [],
      aiDiagnosis: undefined
    })
    setIsEditing(false)
    setCurrentRecord(null)
    setIsAdvancedMode(false)
    setAiDiagnosis(null)
  }

  const handleEdit = (record: PatientRecord) => {
    setFormData({
      name: record.name,
      age: record.age,
      gender: record.gender,
      historialClinico: record.historialClinico,
      antecedentes: record.antecedentes,
      sintomas: record.sintomas,
      diagnosticos: record.diagnosticos,
      tratamientos: record.tratamientos,
      notas: record.notas,
      images: record.images || [],
      estudiosImagen: (record as any).estudiosImagen || '',
      estudiosImagenFiles: (record as any).estudiosImagenFiles || [],
      pruebasComplementarias: (record as any).pruebasComplementarias || '',
      pruebasComplementariasFiles: (record as any).pruebasComplementariasFiles || [],
      aiDiagnosis: record.aiDiagnosis || undefined
    })
    
    // Cargar diagnóstico de IA si existe
    if (record.aiDiagnosis) {
      setAiDiagnosis(record.aiDiagnosis)
      setIsAdvancedMode(true)
    }
    
    setIsEditing(true)
    setCurrentRecord(record)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('¿Está seguro que desea eliminar este registro?')) {
      setIsLoading(true)
      setError(null)
      
      try {
        await apiService.deletePatient(id)
        setRecords(records.filter(record => record.id !== id))
      } catch (err) {
        setError('Error al eliminar el registro')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const filteredRecords = records.filter(record =>
    record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.diagnosticos.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Registros Médicos</h1>
              <p className="text-gray-600">Gestión de historias clínicas de pacientes</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSettingsOpen(true)}
                className="flex items-center gap-2"
              >
                <SettingsIcon className="h-4 w-4" />
                Ajustes
              </Button>
              {isServerOnline ? (
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                  Servidor conectado
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <WifiOff className="h-4 w-4" />
                  Servidor desconectado
                </div>
              )}
            </div>
          </div>
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {error}
            </div>
          )}
        </header>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Main content */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar pacientes..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button onClick={() => setIsFormOpen(true)} disabled={!isServerOnline || isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                Nuevo Registro
              </Button>
            </div>

            {isLoading && filteredRecords.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                  <p className="text-gray-500">Cargando registros...</p>
                </CardContent>
              </Card>
            ) : filteredRecords.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-gray-500">
                    {searchTerm ? 'No se encontraron registros' : 'No hay registros aún'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredRecords.map(record => (
                  <Card key={record.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5 text-primary" />
                            {record.name}
                          </CardTitle>
                          <CardDescription>
                            {record.age} años • {record.gender} • {new Date(record.createdAt).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          {record.aiDiagnosis && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => {
                                setAiDiagnosis(record.aiDiagnosis)
                                setIsDiagnosisViewerOpen(true)
                              }}
                              className="text-blue-600 hover:text-blue-700"
                              title="Ver Diagnóstico IA"
                            >
                              <Sparkles className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(record)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(record.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-gray-700">Diagnósticos:</p>
                          <p className="text-gray-600">{record.diagnosticos || 'No especificado'}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Tratamientos:</p>
                          <p className="text-gray-600">{record.tratamientos || 'No especificado'}</p>
                        </div>
                      </div>
                      {record.images && record.images.length > 0 && (
                        <div className="mt-4">
                          <p className="font-medium text-gray-700 mb-2">Imágenes:</p>
                          <div className="flex flex-wrap gap-2">
                            {record.images.map((img, index) => {
                              const filename = img.split('/').pop() || img
                              return (
                                <div key={index} className="relative">
                                  <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden">
                                    <img 
                                      src={apiService.getImageUrl(filename)} 
                                      alt={`Imagen ${index + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Form sidebar */}
          {isFormOpen && (
            <div className="md:w-96">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{isEditing ? 'Editar Registro' : 'Nuevo Registro'}</span>
                    <Switch
                      checked={isAdvancedMode}
                      onCheckedChange={setIsAdvancedMode}
                      leftLabel="Normal"
                      rightLabel="Avanzado"
                    />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nombre del Paciente</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="age">Edad</Label>
                        <Input
                          id="age"
                          name="age"
                          type="number"
                          value={formData.age}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="gender">Género</Label>
                        <Input
                          id="gender"
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="flex items-center gap-1" htmlFor="historialClinico">
                        <ClipboardList className="h-4 w-4" />
                        Historial Clínico
                      </Label>
                      <Textarea
                        id="historialClinico"
                        name="historialClinico"
                        value={formData.historialClinico}
                        onChange={handleInputChange}
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label className="flex items-center gap-1" htmlFor="antecedentes">
                        <HeartPulse className="h-4 w-4" />
                        Antecedentes
                      </Label>
                      <Textarea
                        id="antecedentes"
                        name="antecedentes"
                        value={formData.antecedentes}
                        onChange={handleInputChange}
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label className="flex items-center gap-1" htmlFor="sintomas">
                        <HeartPulse className="h-4 w-4" />
                        Síntomas
                      </Label>
                      <Textarea
                        id="sintomas"
                        name="sintomas"
                        value={formData.sintomas}
                        onChange={handleInputChange}
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label className="flex items-center gap-1" htmlFor="diagnosticos">
                        <FileText className="h-4 w-4" />
                        Diagnósticos
                      </Label>
                      <Textarea
                        id="diagnosticos"
                        name="diagnosticos"
                        value={formData.diagnosticos}
                        onChange={handleInputChange}
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label className="flex items-center gap-1" htmlFor="tratamientos">
                        <Pill className="h-4 w-4" />
                        Tratamientos
                        {isAdvancedMode && (
                          <span className="text-xs text-blue-600 ml-2">(Se generará por IA)</span>
                        )}
                      </Label>
                      <Textarea
                        id="tratamientos"
                        name="tratamientos"
                        value={formData.tratamientos}
                        onChange={handleInputChange}
                        rows={3}
                        disabled={isAdvancedMode}
                        className={isAdvancedMode ? "bg-gray-100 cursor-not-allowed" : ""}
                        placeholder={isAdvancedMode ? "El tratamiento será sugerido por la IA" : ""}
                      />
                    </div>

                    <div>
                      <Label htmlFor="notas">Notas Adicionales</Label>
                      <Textarea
                        id="notas"
                        name="notas"
                        value={formData.notas}
                        onChange={handleInputChange}
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label className="flex items-center gap-1">
                        <ImageIcon className="h-4 w-4" />
                        Imágenes Médicas
                      </Label>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        multiple
                        accept="image/*"
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Subir Imágenes
                      </Button>
                      {formData.images.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-500 mb-1">Imágenes seleccionadas:</p>
                          <div className="flex flex-wrap gap-2">
                            {formData.images.map((img, index) => {
                              const filename = img.split('/').pop() || img
                              return (
                                <div key={index} className="relative">
                                  <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden">
                                    <img 
                                      src={apiService.getImageUrl(filename)} 
                                      alt={`Imagen ${index + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <button 
                                    onClick={() => removeImage(index)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                  >
                                    ×
                                  </button>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Campos Avanzados */}
                    {isAdvancedMode && (
                      <div className="space-y-4 border-t-2 border-blue-200 pt-4">
                        <div className="flex items-center gap-2 text-blue-600 font-semibold">
                          <Sparkles className="h-5 w-5" />
                          <span>Modo Avanzado con IA</span>
                        </div>

                        <div>
                          <Label htmlFor="estudiosImagen">
                            📊 Estudios de Imagen
                          </Label>
                          <Textarea
                            id="estudiosImagen"
                            name="estudiosImagen"
                            value={formData.estudiosImagen}
                            onChange={handleInputChange}
                            rows={3}
                            placeholder="Describe los estudios de imagen (radiografías, tomografías, resonancias, etc.)"
                          />
                        </div>

                        <div>
                          <Label htmlFor="pruebasComplementarias">
                            🔬 Pruebas Complementarias
                          </Label>
                          <Textarea
                            id="pruebasComplementarias"
                            name="pruebasComplementarias"
                            value={formData.pruebasComplementarias}
                            onChange={handleInputChange}
                            rows={3}
                            placeholder="Describe las pruebas complementarias (análisis de sangre, biopsias, etc.)"
                          />
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                          <p className="font-semibold mb-1">💡 Consejo:</p>
                          <ul className="list-disc list-inside space-y-1">
                            <li>Describa los estudios de imagen y pruebas en los campos de texto</li>
                            <li>Puede subir imágenes usando el botón "Subir Imágenes" arriba</li>
                            <li>La IA analizará toda la información para generar el diagnóstico</li>
                          </ul>
                        </div>

                        <Button
                          type="button"
                          onClick={handleGenerateAIDiagnosis}
                          disabled={isGeneratingDiagnosis}
                          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        >
                          {isGeneratingDiagnosis ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Generando Diagnóstico...
                            </>
                          ) : (
                            <>
                              <Sparkles className="mr-2 h-4 w-4" />
                              Generar Diagnóstico por IA
                            </>
                          )}
                        </Button>

                        {aiDiagnosis && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsDiagnosisViewerOpen(true)}
                            className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                          >
                            👁️ Ver Diagnóstico por IA
                          </Button>
                        )}
                      </div>
                    )}

                    <div className="flex justify-end gap-2 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsFormOpen(false)
                          resetForm()
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Guardando...
                          </>
                        ) : (
                          isEditing ? 'Actualizar' : 'Guardar'
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Modales */}
      <Settings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
      
      <AIDiagnosisViewer
        isOpen={isDiagnosisViewerOpen}
        onClose={() => setIsDiagnosisViewerOpen(false)}
        result={aiDiagnosis}
        isLoading={isGeneratingDiagnosis}
      />
    </div>
  )
}