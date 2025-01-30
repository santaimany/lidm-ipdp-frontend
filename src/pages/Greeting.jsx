import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Ganti useHistory dengan useNavigate
import animate from "../assets/Greeting/animate_1.svg";
import angry from "../assets/Greeting/angry.svg";
import ok from "../assets/Greeting/ok.svg";
import good from "../assets/Greeting/good.svg";
import great from "../assets/Greeting/great.svg";

const greetings = [
  {
    src: angry,
    label: "Sad",
    textColor: "text-red-500",
    message: "Terkadang merasa sedih itu wajar, tapi jangan biarkan itu menghentikan langkahmu. Kamu lebih kuat dari yang kamu kira!",
  },
  {
    src: ok,
    label: "Ok",
    textColor: "text-yellow-400",
    message: "Mungkin hari ini tidak berjalan seperti yang kamu harapkan, tapi itu bukan akhir dari segalanya. Tetap semangat dan terus berjuang!",
  },
  {
    src: good,
    label: "Good",
    textColor: "text-green-500",
    message: "Kerja bagus! Kamu sudah berada di jalur yang tepat, jangan ragu untuk terus maju. Semangat terus!",
  },
  {
    src: great,
    label: "Great",
    textColor: "text-green-400",
    message: "Kamu luar biasa! Terus bersinar dan jangan pernah ragu untuk mengejar impianmu. Kamu bisa lebih dari ini!",
  },
];

const Greeting = () => {
  const [selectedMessage, setSelectedMessage] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [clicked, setClicked] = useState(false); // Menambahkan state untuk klik
  const [selectedLabel, setSelectedLabel] = useState(""); // Menambahkan state untuk label
  const [selectedTextColor, setSelectedTextColor] = useState(""); // State untuk menyimpan warna
  const navigate = useNavigate(); // Hook untuk routing

const greetingname = localStorage.getItem("name");
console.log(greetingname);  
  const handleClick = (message, index, label, textColor) => {
    setSelectedMessage(message); // Set pesan yang dipilih
    setSelectedIndex(index); // Set index emotikon yang dipilih
    setSelectedLabel(label); // Set label emotikon yang dipilih
    setSelectedTextColor(textColor); // Set warna teks
    setClicked(true); // Menandakan bahwa emotikon sudah diklik
    setShowConfirmation(true); // Tampilkan konfirmasi setelah klik
  };

  const handleContinue = () => {
    // Routing ke halaman selanjutnya, misalnya "/next-page"
    navigate("/chapters"); // Gunakan navigate untuk routing
  };

  const handleCancel = () => {
    setShowConfirmation(false); // Menyembunyikan konfirmasi
    setSelectedMessage(""); // Menghapus pesan
    setSelectedIndex(null); // Menyembunyikan semua emotikon
    setClicked(false); // Reset status klik
    setSelectedLabel(""); // Reset label
    setSelectedTextColor(""); // Reset warna
  };

  return (
    <div className="relative min-h-screen flex bg-[#00A38D] overflow-hidden justify-center">
      {/* Teks di bagian atas */}
      {!clicked && (
        <div className="absolute top-10 text-center w-full">
          <h1 className="text-3xl font-semibold text-white first-letter:uppercase">
            Hi, {greetingname} <br /> Bagaimana perasaanmu hari ini?
          </h1>
        </div>
      )}

      {/* Bagian kanan dan kiri, menampilkan gambar animate dan emoticon */}
      {!clicked && (
        <div className="w-full max-w-6xl flex items-center justify-between mt-20 px-4">
          {/* Bagian kiri untuk gambar animate */}
          <div className="flex items-start w-1/2 justify-center md:justify-start">
            <img
              src={animate}
              alt="animate1"
              className="w-full max-w-[350px] h-auto"
            />
          </div>

          {/* Bagian kanan untuk emoticon */}
          <div className="w-full max-w-4xl flex items-center justify-center mt-10 px-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-10 justify-items-center w-full max-w-[1000px]">
              {greetings.map((greet, index) => (
                <div key={index} className="relative group">
                  {/* Emotikon */}
                  <img
                    src={greet.src}
                    alt={`greeting-${index}`}
                    className="h-24 sm:h-32 md:h-40 w-auto cursor-pointer hover:scale-150 transition-transform duration-200"
                    onClick={() =>
                      handleClick(greet.message, index, greet.label, greet.textColor)
                    } // Menangani klik emotikon
                  />

                  {/* Pop-up text saat hover */}
                  <div className="mt-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span
                      className={`text-sm sm:text-xl md:text-3xl font-bold ${greet.textColor} p-2`}
                    >
                      {greet.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Menampilkan hanya modal konfirmasi setelah emotikon diklik */}
      {showConfirmation && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg w-11/12 md:w-1/2">
          {/* Menampilkan label di bagian atas modal */}
          <h2 className={`text-3xl font-bold text-center ${selectedTextColor}`}>{selectedLabel}</h2>
          <h3 className="text-xl font-bold text-center mt-2">{selectedMessage}</h3>
          <p className="mt-2 text-center">Apakah kamu ingin melanjutkan?</p>
          <div className="flex justify-between mt-4">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-md"
              onClick={handleCancel}
            >
              Batal
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-md"
              onClick={handleContinue}
            >
              Lanjutkan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Greeting;
