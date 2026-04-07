export default function Background() {
    return (
      <div className="fixed inset-0 -z-10 h-full w-full bg-[#050505]">
        {/* Grille de points visible */}
        <div 
          className="absolute inset-0 h-full w-full opacity-20" 
          style={{ 
            backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
            backgroundSize: '30px 30px' 
          }}
        ></div>
  
        {/* Lueur rouge en haut (Glow) */}
        <div className="absolute left-1/2 top-0 -z-10 h-[500px] w-full -translate-x-1/2 -translate-y-1/2 bg-red-600/20 blur-[120px] rounded-full"></div>
      </div>
    );
  }