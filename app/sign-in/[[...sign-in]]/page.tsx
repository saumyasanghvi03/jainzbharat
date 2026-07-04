import { SignIn } from '@clerk/nextjs';
export default function SignInPage() { return <section className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4 py-16"><SignIn routing="path" path="/sign-in" /></section>; }
