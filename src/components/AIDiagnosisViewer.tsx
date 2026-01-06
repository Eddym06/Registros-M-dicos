import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

interface DiagnosisResult {
  diagnostico_probable: string;
  analisis: string;
  tratamiento: string;
  sugerencias: string;
}

interface AIDiagnosisViewerProps {
  isOpen: boolean;
  onClose: () => void;
  result: DiagnosisResult | null;
  isLoading: boolean;
}

export const AIDiagnosisViewer: React.FC<AIDiagnosisViewerProps> = ({ 
  isOpen, 
  onClose, 
  result,
  isLoading 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-4 py-8">
        <Card className="w-full max-w-4xl shadow-2xl my-8">
          <CardHeader className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 sticky top-0 z-10">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center text-2xl">
                <span className="mr-3">🤖</span>
                Diagnóstico Asistido por IA
              </span>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors text-2xl hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center"
              >
                ✕
              </button>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-6 max-h-[70vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="animate-spin text-6xl">🧠</div>
              <p className="text-lg text-gray-600">Analizando datos médicos...</p>
              <p className="text-sm text-gray-400">Grok está procesando la información</p>
            </div>
          ) : result ? (
            <div className="space-y-6">
              {/* Diagnóstico Probable */}
              <div className="bg-blue-50 border-l-4 border-blue-600 rounded-r-lg p-4">
                <h3 className="font-bold text-lg text-blue-900 mb-2 flex items-center">
                  <span className="mr-2">🔍</span>
                  Diagnóstico Probable
                </h3>
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {result.diagnostico_probable}
                </p>
              </div>

              {/* Análisis */}
              <div className="bg-purple-50 border-l-4 border-purple-600 rounded-r-lg p-4">
                <h3 className="font-bold text-lg text-purple-900 mb-2 flex items-center">
                  <span className="mr-2">📊</span>
                  Análisis Clínico
                </h3>
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {result.analisis}
                </p>
              </div>

              {/* Tratamiento */}
              <div className="bg-green-50 border-l-4 border-green-600 rounded-r-lg p-4">
                <h3 className="font-bold text-lg text-green-900 mb-2 flex items-center">
                  <span className="mr-2">💊</span>
                  Tratamiento Recomendado
                </h3>
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {result.tratamiento}
                </p>
              </div>

              {/* Sugerencias */}
              <div className="bg-yellow-50 border-l-4 border-yellow-600 rounded-r-lg p-4">
                <h3 className="font-bold text-lg text-yellow-900 mb-2 flex items-center">
                  <span className="mr-2">💡</span>
                  Sugerencias Adicionales
                </h3>
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {result.sugerencias}
                </p>
              </div>

              {/* Disclaimer */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
                <p className="font-semibold mb-1">⚠️ Aviso Importante</p>
                <p>
                  Este diagnóstico es generado por IA y debe ser considerado como una herramienta de apoyo.
                  El criterio médico profesional siempre prevalece sobre las sugerencias de la IA.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No hay diagnóstico disponible
            </div>
          )}
          
          </CardContent>
          
          <div className="border-t border-gray-200 p-4 bg-gray-50 sticky bottom-0">
            <div className="flex justify-end">
              <Button
                onClick={onClose}
                className="bg-gray-600 hover:bg-gray-700"
              >
                Cerrar
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
