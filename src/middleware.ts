import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rutas que no requieren autenticación
const publicPaths = ['/sign-in', '/api'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Si es una ruta pública, permitir acceso
  if (publicPaths.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }
  
  // Verificar token en cookies
  const token = request.cookies.get('token')?.value;
  
  // Si no hay token, redirigir al login
  if (!token) {
    // Redirigir a login con la URL actual como parámetro para volver después
    const url = new URL('/sign-in', request.url);
    return NextResponse.redirect(url);
  }
  
  // Si hay token, continuar
  return NextResponse.next();
}

// Configuración específica para que funcione correctamente
export const config = {
  matcher: [
    // Proteger todas las rutas excepto archivos estáticos
    '/((?!_next/static|_next/image|favicon.ico|sign-in|api).*)',
  ],
};