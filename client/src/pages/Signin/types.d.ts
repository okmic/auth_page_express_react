export interface SignInFormData {
  email: string
  psw: string
}

export interface SignInFormErrors {
  email?: string
  psw?: string
}

export interface SignInFormProps {
  onSubmit: (data: SignInFormData) => void
  isLoading?: boolean
  error?: string | null
}