export default function FreshStatement() {
  return (
    <div className="w-full relative overflow-hidden min-h-[400px] flex items-center justify-center">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/freshveg.mp4" type="video/mp4" />
      </video>
      <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-10"></div>
      <div className="relative z-20 p-8 md:p-16 text-center max-w-5xl mx-auto flex flex-col items-center gap-6">
        <p className="text-white text-2xl md:text-4xl font-bold uppercase leading-relaxed tracking-wider shadow-sm drop-shadow-md">
          We believe great meals begin with premium ingredients. Using quality halal chicken and local ingredients from trusted suppliers
        </p>
      </div>
    </div>
  );
}
