'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Search, Home, Users, BookOpen, User as UserIcon, LogOut } from 'lucide-react'
import { Media, User } from '@/payload-types'

interface NavBarProps {
  user?: User | null
}

export function NavBar({ user }: NavBarProps) {
  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y título */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">UNSA Blog 2026</h1>
                <p className="text-xs text-gray-500">Plataforma Electoral</p>
              </div>
            </Link>
          </div>

          {/* Navegación principal */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
              <Home className="h-4 w-4" />
              <span>Inicio</span>
            </Link>
            <Link href="/candidatos" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
              <Users className="h-4 w-4" />
              <span>Candidatos</span>
            </Link>
            <Link href="/posts" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
              <BookOpen className="h-4 w-4" />
              <span>Posts</span>
            </Link>
          </div>

          {/* Búsqueda y usuario */}
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage 
                        src={(user.profileImage as Media)?.url || undefined} 
                        alt={user.fullName} 
                      />
                      <AvatarFallback>
                        {user.fullName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.fullName}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                      <p className="text-xs leading-none text-blue-600 font-medium">
                        {user.userType === 'candidate' ? 'Candidato' : 
                         user.userType === 'admin' ? 'Administrador' : 'Votante'}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`/perfil/${user.id}`} className="flex items-center">
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>Mi Perfil</span>
                    </Link>
                  </DropdownMenuItem>
                  {user.userType === 'candidate' && (
                    <DropdownMenuItem asChild>
                      <Link href="/mis-posts" className="flex items-center">
                        <BookOpen className="mr-2 h-4 w-4" />
                        <span>Mis Posts</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/api/users/logout" className="flex items-center text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Cerrar Sesión</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/login">Iniciar Sesión</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/registro">Registrarse</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}