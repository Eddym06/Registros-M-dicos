// API Service for Medical Records
// Handles all communication with the FastAPI backend

const API_BASE_URL = 'http://localhost:5847';

export interface PatientRecord {
  id: string;
  name: string;
  age: string;
  gender: string;
  historialClinico: string;
  antecedentes: string;
  sintomas: string;
  diagnosticos: string;
  tratamientos: string;
  notas: string;
  images: string[];
  estudiosImagen?: string;
  estudiosImagenFiles?: string[];
  pruebasComplementarias?: string;
  pruebasComplementariasFiles?: string[];
  aiDiagnosis?: {
    diagnostico_probable: string;
    analisis: string;
    tratamiento: string;
    sugerencias: string;
  };
  createdAt: string;
  updatedAt?: string;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // Check if server is online
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  // Get all patients
  async getPatients(): Promise<PatientRecord[]> {
    try {
      const response = await fetch(`${this.baseUrl}/patients`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.patients || [];
    } catch (error) {
      console.error('Error fetching patients:', error);
      throw error;
    }
  }

  // Get single patient
  async getPatient(id: string): Promise<PatientRecord> {
    try {
      const response = await fetch(`${this.baseUrl}/patients/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching patient:', error);
      throw error;
    }
  }

  // Create new patient
  async createPatient(patient: Omit<PatientRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<PatientRecord> {
    try {
      const response = await fetch(`${this.baseUrl}/patients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patient),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating patient:', error);
      throw error;
    }
  }

  // Update patient
  async updatePatient(id: string, patient: Omit<PatientRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<PatientRecord> {
    try {
      const response = await fetch(`${this.baseUrl}/patients/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patient),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating patient:', error);
      throw error;
    }
  }

  // Delete patient
  async deletePatient(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/patients/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting patient:', error);
      throw error;
    }
  }

  // Upload image
  async uploadImage(file: File, patientId: string): Promise<{ filename: string; path: string; url: string }> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('patient_id', patientId);

      const response = await fetch(`${this.baseUrl}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  // Get image URL
  getImageUrl(filename: string): string {
    return `${this.baseUrl}/images/${filename}`;
  }

  // Delete image
  async deleteImage(filename: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/images/${filename}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }

  // List backups
  async listBackups(): Promise<Array<{ filename: string; created: string; size: number }>> {
    try {
      const response = await fetch(`${this.baseUrl}/backup/list`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.backups || [];
    } catch (error) {
      console.error('Error listing backups:', error);
      throw error;
    }
  }

  // Restore backup
  async restoreBackup(filename: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/backup/restore/${filename}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error restoring backup:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
