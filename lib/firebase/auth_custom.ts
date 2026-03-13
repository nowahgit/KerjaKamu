import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { getUserProfile } from './users'

export async function loginAndRedirect(email: string, password: string, router: any) {
  const credential = await signInWithEmailAndPassword(auth, email, password)
  const profile = await getUserProfile(credential.user.uid)

  if (!profile) {
    router.push('/hasil')
    return
  }

  switch (profile.role) {
    case 'admin':
      router.push('/admin')
      break
    case 'trainer':
      if (profile.status === 'verified') {
        router.push('/trainer/dashboard')
      } else {
        router.push('/daftar-trainer?status=pending')
      }
      break
    default:
      router.push('/hasil')
  }
}
