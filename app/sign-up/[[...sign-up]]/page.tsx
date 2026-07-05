import { SignUp } from '@clerk/nextjs';
export default function SignUpPage() { return <section className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4 py-16"><SignUp routing="path" path="/sign-up" /></section>; }
