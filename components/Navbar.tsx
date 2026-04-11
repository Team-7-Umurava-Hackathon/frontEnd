export default function Navbar() {
    return (
        
        <nav className ="w-full flex justify-between items-center px-6 py-4 bg-primary shadow-md">
            <h1 className="text-xl font-bold text-white">
                AI Recruiter
            </h1>
            <div className="flex gap-4">
                <button className="px-4 py-2 rounded-xl  text-white font-medium bg-primary hover:opacity-70">
                    Positions
                </button>
                <button className="px-4 py-2 rounded-xl  text-white font-medium bg-primary hover:opacity-70">
                    Login
                </button>
            </div>
        </nav>  
    );
}