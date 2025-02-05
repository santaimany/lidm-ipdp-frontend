import { useEffect, useState } from 'react';

const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrolled = (scrollTop / scrollHeight) * 100;
      setProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    // Panggil sekali untuk inisialisasi
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    // Wrapper untuk background indikator (misalnya abu-abu)
    <div className="fixed top-0 left-0 w-full h-[2px] z-50 bg-gray-300">
      {/* Indikator scroll hijau */}
      <div
        className="h-full bg-lime-400 transition-all duration-75"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default ScrollProgress;
