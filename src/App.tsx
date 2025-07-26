// Main App component - Medical Records Management System
// This component provides a complete medical records management interface
// with patient data storage in localStorage and image upload capabilities

import { useState, useEffect, useRef } from 'react'
import { Button } from "./components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./components/ui/card"
import { Input } from "./components/ui/input"
import { Textarea } from "./components/ui/textarea"
import { Label } from "./components/ui/label"
import { Search, Plus, Trash2, Edit, User, ClipboardList, HeartPulse, Pill, FileText, Upload, Image as ImageIcon } from "lucide-react"

type PatientRecord = {
  id: string
  name: string
  age: string
  gender: string
  historialClinico: string
  antecedentes: string
  sintomas: string
  diagnosticos: string
  tratamientos: string
  notas: string
  images: string[]
  createdAt: string
}

export default function App() {
  const [records, setRecords] = useState<PatientRecord[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<PatientRecord | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
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
    images: [] as string[]
  })

  // Load records from localStorage on component mount
  useEffect(() => {
    const savedRecords = localStorage.getItem('patientRecords')
    if (savedRecords) {
      setRecords(JSON.parse(savedRecords))
    }
  }, [])

  // Save records to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('patientRecords', JSON.stringify(records))
  }, [records])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Simulate image upload - in a real app, you would upload to a server
      const newImages = Array.from(e.target.files).map(file => ({
        name: file.name,
        url: URL.createObjectURL(file) // This creates a local URL for preview
      }))
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages.map(img => img.url)]
      }))
    }
  }

  const removeImage = (index: number) => {
    const newImages = [...formData.images]
    newImages.splice(index, 1)
    setFormData(prev => ({
      ...prev,
      images: newImages
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isEditing && currentRecord) {
      // Update existing record
      const updatedRecords = records.map(record => 
        record.id === currentRecord.id ? { ...formData, id: currentRecord.id, createdAt: currentRecord.createdAt } : record
      )
      setRecords(updatedRecords)
    } else {
      // Create new record
      const newRecord = {
        ...formData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      }
      setRecords([newRecord, ...records])
    }
    
    resetForm()
    setIsFormOpen(false)
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
      images: []
    })
    setIsEditing(false)
    setCurrentRecord(null)
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
      images: record.images || []
    })
    setIsEditing(true)
    setCurrentRecord(record)
    setIsFormOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('¿Está seguro que desea eliminar este registro?')) {
      setRecords(records.filter(record => record.id !== id))
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
          <h1 className="text-3xl font-bold text-gray-800">Registros Médicos</h1>
          <p className="text-gray-600">Gestión de historias clínicas de pacientes</p>
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
              <Button onClick={() => setIsFormOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Registro
              </Button>
            </div>

            {filteredRecords.length === 0 ? (
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
                            {record.images.map((img, index) => (
                              <div key={index} className="relative">
                                <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden">
                                  <img 
                                    src={img} 
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
                            ))}
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
                  <CardTitle className="flex items-center gap-2">
                    {isEditing ? 'Editar Registro' : 'Nuevo Registro'}
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
                      </Label>
                      <Textarea
                        id="tratamientos"
                        name="tratamientos"
                        value={formData.tratamientos}
                        onChange={handleInputChange}
                        rows={3}
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
                            {formData.images.map((img, index) => (
                              <div key={index} className="relative">
                                <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden">
                                  <img 
                                    src={img} 
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
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

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
                      <Button type="submit">
                        {isEditing ? 'Actualizar' : 'Guardar'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}