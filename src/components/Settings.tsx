import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadApiKey();
    }
  }, [isOpen]);

  const loadApiKey = async () => {
    try {
      const response = await fetch('http://localhost:5847/api/settings/apikey');
      if (response.ok) {
        const data = await response.json();
        if (data.has_key) {
          setApiKey('••••••••••••••••'); // Mostrar placeholder si existe
          setValidationStatus('valid');
        }
      }
    } catch (error) {
      console.error('Error loading API key:', error);
    }
  };

  const validateApiKey = async (key: string) => {
    if (!key || key === '••••••••••••••••') return;
    
    setIsValidating(true);
    setValidationStatus('idle');
    
    try {
      const response = await fetch('http://localhost:5847/api/settings/validate-apikey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: key })
      });
      
      const data = await response.json();
      console.log('Validation response:', data);
      setValidationStatus(data.valid ? 'valid' : 'invalid');
    } catch (error) {
      console.error('Error validating API key:', error);
      setValidationStatus('invalid');
    } finally {
      setIsValidating(false);
    }
  };

  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    setValidationStatus('idle');
  };

  const handleSaveApiKey = async () => {
    if (!apiKey || apiKey === '••••••••••••••••') return;
    
    setIsSaving(true);
    try {
      const response = await fetch('http://localhost:5847/api/settings/apikey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: apiKey })
      });
      
      if (response.ok) {
        await validateApiKey(apiKey);
        setApiKey('••••••••••••••••');
      }
    } catch (error) {
      console.error('Error saving API key:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-4 shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>⚙️ Configuración</span>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </CardTitle>
          <CardDescription>
            Configure su API Key de Grok para habilitar el diagnóstico asistido por IA
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key de Grok</Label>
            <div className="flex space-x-2">
              <Input
                id="apiKey"
                type="password"
                placeholder="xai-..."
                value={apiKey}
                onChange={(e) => handleApiKeyChange(e.target.value)}
                onBlur={() => apiKey && apiKey !== '••••••••••••••••' && validateApiKey(apiKey)}
                className={`flex-1 ${
                  validationStatus === 'valid' ? 'border-green-500' : 
                  validationStatus === 'invalid' ? 'border-red-500' : ''
                }`}
              />
              <Button
                onClick={handleSaveApiKey}
                disabled={isSaving || validationStatus !== 'valid' || apiKey === '••••••••••••••••'}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSaving ? '💾' : '💾 Guardar'}
              </Button>
            </div>
            
            {isValidating && (
              <p className="text-sm text-gray-500 flex items-center">
                <span className="animate-spin mr-2">⟳</span>
                Validando API Key...
              </p>
            )}
            
            {validationStatus === 'valid' && !isValidating && (
              <p className="text-sm text-green-600 flex items-center">
                ✓ API Key válida y conectada
              </p>
            )}
            
            {validationStatus === 'invalid' && !isValidating && (
              <p className="text-sm text-red-600 flex items-center">
                ✗ API Key inválida o sin conexión
              </p>
            )}
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
            <p className="font-medium mb-1">📌 Información</p>
            <p>
              Obtenga su API Key en{' '}
              <a 
                href="https://console.x.ai/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:text-blue-600"
              >
                console.x.ai
              </a>
            </p>
            <p className="mt-1 text-xs text-blue-600">
              La API Key se guarda de forma segura en el servidor local
            </p>
          </div>
          
          <div className="flex justify-end pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-gray-300"
            >
              Cerrar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
