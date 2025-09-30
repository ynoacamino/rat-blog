import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'fullName',
  },
  auth: true,
  fields: [
    // Email added by default
    {
      name: 'fullName',
      type: 'text',
      required: true,
      label: 'Nombre Completo',
    },
    {
      name: 'userType',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Usuario Común',
          value: 'common',
        },
        {
          label: 'Candidato',
          value: 'candidate',
        },
      ],
      defaultValue: 'common',
      admin: {
        description: 'Tipo de usuario en la plataforma',
      },
    },
    {
      name: 'profileImage',
      type: 'relationship',
      relationTo: 'media',
      label: 'Foto de Perfil',
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'Biografía',
      admin: {
        description: 'Breve descripción personal',
      },
    },
    // Campos específicos para candidatos
    {
      name: 'candidateInfo',
      type: 'group',
      label: 'Información del Candidato',
      admin: {
        condition: (data) => data.userType === 'candidate',
        description: 'Información específica para candidatos',
      },
      fields: [
        {
          name: 'faculty',
          type: 'select',
          label: 'Facultad',
          options: [
            { label: 'Ingeniería de Producción y Servicios', value: 'ips' },
            { label: 'Ingeniería Civil', value: 'civil' },
            { label: 'Ingeniería de Procesos', value: 'procesos' },
            { label: 'Medicina Humana', value: 'medicina' },
            { label: 'Enfermería', value: 'enfermeria' },
            { label: 'Ciencias Biológicas y Agropecuarias', value: 'biologicas' },
            { label: 'Ciencias Naturales y Formales', value: 'naturales' },
            { label: 'Ciencias Sociales', value: 'sociales' },
            { label: 'Ciencias de la Educación', value: 'educacion' },
            { label: 'Ciencias Contables y Financieras', value: 'contables' },
            { label: 'Administración', value: 'administracion' },
            { label: 'Derecho', value: 'derecho' },
            { label: 'Psicología, RR.II. y CC. de la Comunicación', value: 'psicologia' },
            { label: 'Filosofía y Humanidades', value: 'filosofia' },
            { label: 'Arquitectura y Urbanismo', value: 'arquitectura' },
          ],
        },
        {
          name: 'position',
          type: 'select',
          label: 'Cargo',
          options: [
            { label: 'Rector', value: 'rector' },
            { label: 'Vicerrector Académico', value: 'vicerrector_academico' },
            { label: 'Vicerrector de Investigación', value: 'vicerrector_investigacion' },
            { label: 'Decano', value: 'decano' },
            { label: 'Vicedecano', value: 'vicedecano' },
            { label: 'Director de Escuela', value: 'director_escuela' },
            { label: 'Representante Estudiantil', value: 'representante_estudiantil' },
          ],
        },
        {
          name: 'proposal',
          type: 'richText',
          label: 'Propuesta Electoral',
          admin: {
            description: 'Propuesta principal del candidato',
          },
        },
        {
          name: 'experience',
          type: 'array',
          label: 'Experiencia',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Cargo/Posición',
              required: true,
            },
            {
              name: 'organization',
              type: 'text',
              label: 'Organización/Institución',
              required: true,
            },
            {
              name: 'period',
              type: 'text',
              label: 'Período',
              admin: {
                description: 'Ej: 2020-2024, Enero 2023 - Presente',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Descripción',
            },
          ],
        },
        {
          name: 'socialLinks',
          type: 'group',
          label: 'Redes Sociales',
          fields: [
            {
              name: 'facebook',
              type: 'text',
              label: 'Facebook',
            },
            {
              name: 'twitter',
              type: 'text',
              label: 'Twitter/X',
            },
            {
              name: 'instagram',
              type: 'text',
              label: 'Instagram',
            },
            {
              name: 'linkedin',
              type: 'text',
              label: 'LinkedIn',
            },
            {
              name: 'website',
              type: 'text',
              label: 'Sitio Web',
            },
          ],
        },
      ],
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Usuario Activo',
      defaultValue: true,
      admin: {
        description: 'Si está desmarcado, el usuario no podrá acceder',
      },
    },
  ],
  access: {
    read: () => true, // Todos pueden leer perfiles públicos
    create: () => true, // Cualquiera puede registrarse
    update: ({ req: { user } }) => {
      // Los usuarios solo pueden actualizar su propio perfil
      if (user) {
        return {
          id: {
            equals: user.id,
          },
        }
      }
      return false
    },
    delete: ({ req: { user } }) => {
      // Solo admins pueden eliminar usuarios (por ahora deshabilitado)
      return false
    },
  },
}
