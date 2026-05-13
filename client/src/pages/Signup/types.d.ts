export interface SignUpFormData {
  name: string
  email: string
  psw: string
  confirmPsw: string
}

export interface SignUpFormErrors {
  name?: string
  email?: string
  psw?: string
  confirmPsw?: string
}

export interface SignUpFormProps {
  onSubmit: (data: Omit<SignUpFormData, 'confirmPsw'>) => void
  isLoading?: boolean
  error?: string | null
}
