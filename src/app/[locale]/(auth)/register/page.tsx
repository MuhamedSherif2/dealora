import Register from "@/feature/auth/register/Register"

function Page() {
    return (
        <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[radial-gradient(60%_50%_at_50%_0%,color-mix(in_oklab,var(--primary)_12%,transparent),transparent)] px-4 py-10">
            <Register />
        </main>
    )
}
export default Page