import { Atom } from "lucide-react"
export default function Page() {
  return (
    <div className="fixed pl-30 inset-0 flex items-center justify-center">
      <Atom 
        className="w-45 h-45" 
        style={{ 
          animation: 'spin 5s linear infinite, colorChange 6s ease-in-out infinite',
          animationName: 'spin, colorChange'
        }} 
      />
      <style>{`
        @keyframes colorChange {
          0%, 100% { color: rgb(51 65 85 / 0.8); }
          50% { color: rgb(59 130 246 / 0.8); }
        }
      `}</style>
    </div>
  )
}