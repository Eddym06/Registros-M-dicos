#!/usr/bin/env python3
"""
Native Messaging Host for Medical Records Extension
Handles communication between Chrome Extension and local system
Allows extension to start/stop the server
"""

import sys
import json
import struct
import subprocess
import platform
from pathlib import Path
import traceback
from typing import Dict, Any

# Log file for debugging
LOG_FILE = Path(__file__).parent / 'native-host.log'

def log(message: str) -> None:
    """Write debug log"""
    try:
        with open(LOG_FILE, 'a', encoding='utf-8') as f:
            f.write(f"{message}\n")
    except:
        pass

def get_message():
    """Read a message from Chrome extension"""
    raw_length = sys.stdin.buffer.read(4)
    if not raw_length:
        sys.exit(0)
    message_length = struct.unpack('=I', raw_length)[0]
    message = sys.stdin.buffer.read(message_length).decode('utf-8')
    return json.loads(message)

def send_message(message: Dict[str, Any]) -> None:
    """Send a message to Chrome extension"""
    encoded_content = json.dumps(message).encode('utf-8')
    encoded_length = struct.pack('=I', len(encoded_content))
    sys.stdout.buffer.write(encoded_length)
    sys.stdout.buffer.write(encoded_content)
    sys.stdout.buffer.flush()

def get_server_path():
    """Get the path to the server directory"""
    # Usar la ubicación real del proyecto
    script_dir = Path(__file__).parent.parent
    server_path = script_dir / 'server'
    return server_path

def start_server() -> Dict[str, Any]:
    """Start the FastAPI server"""
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    
    if not project_root.exists():
        return {
            'success': False,
            'error': 'Project directory not found',
            'path': str(project_root)
        }
    
    try:
        if platform.system() == 'Windows':
            # Usar el script .bat para iniciar el servidor
            bat_script = script_dir / 'start-server-extension.bat'
            
            if not bat_script.exists():
                return {
                    'success': False,
                    'error': 'Start script not found',
                    'path': str(bat_script)
                }
            
            # Ejecutar el script .bat en una nueva consola
            subprocess.Popen(
                [str(bat_script)],
                shell=True,
                creationflags=subprocess.CREATE_NEW_CONSOLE if hasattr(subprocess, 'CREATE_NEW_CONSOLE') else 0
            )
        else:
            # Mac/Linux
            cmd = [
                'python3', '-m', 'uvicorn', 
                'server.main:app',
                '--host', '127.0.0.1',
                '--port', '5847'
            ]
            subprocess.Popen(
                cmd, 
                cwd=str(project_root),
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL
            )
        
        return {
            'success': True,
            'message': 'Server started',
            'port': 5847
        }
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }

def main():
    """Main message loop"""
    log("Native host started")
    try:
        while True:
            try:
                log("Waiting for message...")
                message = get_message()
                log(f"Received message: {message}")
                
                if message.get('command') == 'start_server':
                    log("Starting server...")
                    response = start_server()
                    log(f"Server start response: {response}")
                    send_message(response)
                    log("Response sent")
                
                elif message.get('command') == 'ping':
                    log("Ping received")
                    send_message({'success': True, 'message': 'pong'})
                
                else:
                    log(f"Unknown command: {message.get('command')}")
                    send_message({
                        'success': False,
                        'error': 'Unknown command'
                    })
                    
            except Exception as e:
                error_msg = f"Error in loop: {str(e)}\n{traceback.format_exc()}"
                log(error_msg)
                send_message({
                    'success': False,
                    'error': str(e)
                })
                break
    except Exception as e:
        log(f"Fatal error: {str(e)}\n{traceback.format_exc()}")
        sys.exit(1)

if __name__ == '__main__':
    main()
