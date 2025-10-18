"use client";
import { useState, useRef } from "react";
import { Snackbar, Alert } from "@mui/material";
import { motion } from "framer-motion";

export default function CrosswordDangMui() {
  const words = [
    { 
      text: "ĐẢNGLAOđộngviệtnam", 
      letterIndex: 0, 
      letter: "Đ",
      hint: "Tên chính thức của Đảng Cộng sản Việt Nam từ năm 1951-1976",
      image: "https://images.unsplash.com/photo-1590642916589-592bca10dfbf?w=400"
    },
    { 
      text: "NGUYỄNÁIQUỐC", 
      letterIndex: 5, 
      letter: "Ả",
      hint: "Tên ban đầu của Chủ tịch Hồ Chí Minh",
      image: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=400"
    },
    { 
      text: "GIAIẤPCÔNGNHÂN", 
      letterIndex: 4, 
      letter: "N",
      hint: "Giai cấp lãnh đạo cách mạng Việt Nam",
      image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400"
    },
    { 
      text: "GIẢIPHÓNGDÂNTỘC", 
      letterIndex: 5, 
      letter: "G",
      hint: "Nhiệm vụ trước mắt của cách mạng Việt Nam trước năm 1945",
      image: "https://images.unsplash.com/photo-1590642916746-7efa043a1333?w=400"
    },
    { 
      text: "CHỦNGHĨAMÁCLÊNIN", 
      letterIndex: 8, 
      letter: "C",
      hint: "Nền tảng tư tưởng của Đảng Cộng sản Việt Nam",
      image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400"
    },
    { 
      text: "QUỐCTẾCỘNGSẢN", 
      letterIndex: 7, 
      letter: "Ô",
      hint: "Tổ chức quốc tế của các Đảng Cộng sản do Lenin thành lập năm 1919",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400"
    },
    { 
      text: "NHÂNDÂN", 
      letterIndex: 4, 
      letter: "N",
      hint: "Chủ thể của cách mạng, người làm chủ đất nước",
      image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400"
    },
    { 
      text: "GIAIẤP", 
      letterIndex: 4, 
      letter: "G",
      hint: "Nhóm người có cùng địa vị trong xã hội về mặt kinh tế",
      image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=400"
    },
    { 
      text: "ĐÔNGDƯƠNGCỘNGSẢNĐẢNG", 
      letterIndex: 13, 
      letter: "S",
      hint: "Tên Đảng từ năm 1930-1951, được thành lập ngày 3/2/1930",
      image: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=400"
    },
    { 
      text: "CÁCHMẠNGTHÁNG10NGA", 
      letterIndex: 12, 
      letter: "Ả",
      hint: "Cuộc cách mạng xã hội chủ nghĩa đầu tiên thành công năm 1917",
      image: "https://images.unsplash.com/photo-1547448415-e9f5b28e570d?w=400"
    },
    { 
      text: "CHỦNGHĨAXÃHỘI", 
      letterIndex: 8, 
      letter: "N",
      hint: "Chế độ xã hội mà nhân dân lao động làm chủ tập thể",
      image: "https://images.unsplash.com/photo-1569025743873-ea3a9ade89f9?w=400"
    },
  ];

  const [userInput, setUserInput] = useState(words.map((w) => Array(w.text.length).fill("")));
  const [rowStatus, setRowStatus] = useState<(null | "correct" | "wrong")[]>(Array(words.length).fill(null));
  const [focusedRow, setFocusedRow] = useState<number | null>(null);
  const [currentRowIndex, setCurrentRowIndex] = useState<number | null>(null);
  const [showHintText, setShowHintText] = useState(false);
  const [snack, setSnack] = useState<{ open: boolean; message: string; severity: "success" | "error" | "info" }>({
    open: false,
    message: "",
    severity: "info",
  });

  const inputRefs = useRef<(HTMLInputElement | null)[][]>(
    words.map((w) => Array(w.text.length).fill(null))
  );

  const popupInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (r: number, c: number, val: string) => {
    const newChar = val.toUpperCase().slice(0, 1);
    
    const newGrid = userInput.map((row) => [...row]);
    newGrid[r][c] = newChar;
    setUserInput(newGrid);
  };

  const handlePopupChange = (r: number, c: number, val: string) => {
    const newChar = val.toUpperCase().slice(0, 1);
    
    const newGrid = userInput.map((row) => [...row]);
    newGrid[r][c] = newChar;
    setUserInput(newGrid);
  };

  const handlePopupKeyDown = (r: number, c: number, e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      handleClosePopup();
      return;
    }
    
    if (e.key === "Backspace") {
      if (!userInput[r][c] && c > 0) {
        e.preventDefault();
        const newGrid = userInput.map((row) => [...row]);
        newGrid[r][c - 1] = "";
        setUserInput(newGrid);
        popupInputRefs.current[c - 1]?.focus();
      } else {
        const newGrid = userInput.map((row) => [...row]);
        newGrid[r][c] = "";
        setUserInput(newGrid);
      }
    }
    else if (e.key === "ArrowLeft" && c > 0) {
      e.preventDefault();
      popupInputRefs.current[c - 1]?.focus();
    } else if (e.key === "ArrowRight" && c < words[r].text.length - 1) {
      e.preventDefault();
      popupInputRefs.current[c + 1]?.focus();
    }
  };

  const handleKeyDown = (r: number, c: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace") {
      if (!userInput[r][c] && c > 0) {
        e.preventDefault();
        const newGrid = userInput.map((row) => [...row]);
        newGrid[r][c - 1] = "";
        setUserInput(newGrid);
        inputRefs.current[r][c - 1]?.focus();
      } else {
        const newGrid = userInput.map((row) => [...row]);
        newGrid[r][c] = "";
        setUserInput(newGrid);
      }
    }
    else if (e.key === "ArrowLeft" && c > 0) {
      e.preventDefault();
      inputRefs.current[r][c - 1]?.focus();
    } else if (e.key === "ArrowRight" && c < words[r].text.length - 1) {
      e.preventDefault();
      inputRefs.current[r][c + 1]?.focus();
    } else if (e.key === "ArrowUp" && r > 0) {
      e.preventDefault();
      inputRefs.current[r - 1][c]?.focus();
    } else if (e.key === "ArrowDown" && r < words.length - 1) {
      e.preventDefault();
      inputRefs.current[r + 1][c]?.focus();
    }
  };

  const handleFocus = (rIdx: number) => {
    setFocusedRow(rIdx);
    setCurrentRowIndex(rIdx);
    setShowHintText(false);
  };

  const handleClosePopup = () => {
    setCurrentRowIndex(null);
    setShowHintText(false);
  };

  const checkRow = (rIdx: number) => {
    const userWord = userInput[rIdx].join("").normalize("NFC");
    const correctWord = words[rIdx].text.normalize("NFC");
    const newStatus = [...rowStatus];

    if (userWord === correctWord) {
      newStatus[rIdx] = "correct";
      setSnack({ open: true, message: `✅ Chính xác!`, severity: "success" });
    } else {
      newStatus[rIdx] = "wrong";
      setSnack({ open: true, message: "❌ Chưa đúng, thử lại nhé!", severity: "error" });
    }

    setRowStatus(newStatus);
  };

  const checkPopupRow = () => {
    if (currentRowIndex === null) return;
    
    checkRow(currentRowIndex);
    const userWord = userInput[currentRowIndex].join("").normalize("NFC");
    const correctWord = words[currentRowIndex].text.normalize("NFC");
    
    if (userWord === correctWord) {
      setTimeout(() => {
        handleClosePopup();
      }, 1500);
    }
  };

  const checkVertical = () => {
    const verticalWord = words.map((w, i) => {
      const c = w.letterIndex;
      return userInput[i][c] || "_";
    });
    const keyword = verticalWord.join("").normalize("NFC");

    if (keyword === "ĐẢNGCỘNGSẢN") {
      setSnack({ open: true, message: `🎉 Chính xác! Từ khóa dọc là: ĐẢNG CỘNG SẢN 🇻🇳`, severity: "success" });
    } else {
      setSnack({
        open: true,
        message: `❌ Chưa đúng! Hiện tại bạn có: ${keyword}`,
        severity: "error",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-700 via-red-600 to-yellow-600 text-white flex flex-col items-center py-10 px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <motion.div
        className="absolute top-10 left-10 w-32 h-32 opacity-10"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <span className="text-9xl">⭐</span>
      </motion.div>

      <motion.div
        className="absolute bottom-10 right-10 w-32 h-32 opacity-10"
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        <span className="text-9xl">🇻🇳</span>
      </motion.div>

      <motion.h1
        className="text-4xl md:text-5xl font-bold mb-2 text-center"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
      >
        🧩 Ô CHỮ LỊCH SỬ VIỆT NAM
      </motion.h1>

      <motion.p
        className="text-lg mb-8 text-yellow-200 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Tìm từ khóa dọc: ĐẢNG CỘNG SẢN
      </motion.p>

      <div className="flex flex-col gap-6 max-w-6xl w-full">
        {words.map((w, rIdx) => (
          <motion.div
            key={rIdx}
            className="flex flex-col md:flex-row items-center gap-4 bg-white/10 backdrop-blur-sm p-4 rounded-xl shadow-lg"
            initial={{ x: rIdx % 2 === 0 ? -100 : 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: rIdx * 0.1, type: "spring" }}
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0 w-full">
              <div className="w-10 h-10 bg-yellow-400 text-red-900 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                {rIdx + 1}
              </div>

              <div className="flex items-center gap-1 justify-center md:justify-start flex-wrap flex-1">
                {Array.from(w.text).map((_, cIdx) => (
                  <motion.input
                    key={cIdx}
                    ref={(el) => {
                      if (!inputRefs.current[rIdx]) inputRefs.current[rIdx] = [];
                      inputRefs.current[rIdx][cIdx] = el;
                    }}
                    maxLength={1}
                    value={userInput[rIdx][cIdx]}
                    onChange={(e) => handleChange(rIdx, cIdx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(rIdx, cIdx, e)}
                    onFocus={() => handleFocus(rIdx)}
                    onBlur={() => setFocusedRow(null)}
                    className={`w-9 h-9 text-center font-bold uppercase border-2 rounded-md transition-all text-sm
                      ${
                        cIdx === w.letterIndex
                          ? "bg-yellow-300 border-yellow-500 text-red-800 shadow-lg"
                          : "bg-yellow-100 border-yellow-400 text-red-900"
                      }
                      ${
                        rowStatus[rIdx] === "correct"
                          ? "bg-green-300 border-green-600 text-green-900"
                          : rowStatus[rIdx] === "wrong"
                          ? "bg-red-200 border-red-500 text-red-900"
                          : ""
                      }`}
                    whileFocus={{ scale: 1.1, rotate: 2 }}
                    whileHover={{ scale: 1.05 }}
                  />
                ))}

                <motion.button
                  onClick={() => checkRow(rIdx)}
                  className="px-3 py-2 bg-yellow-400 text-red-900 font-semibold rounded-lg hover:bg-yellow-300 transition shadow-md ml-2 text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Kiểm tra
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.button
        onClick={checkVertical}
        className="mt-8 px-8 py-3 bg-yellow-500 text-red-900 font-bold text-lg rounded-lg hover:bg-yellow-400 transition shadow-xl"
        whileHover={{ scale: 1.1, rotate: 2 }}
        whileTap={{ scale: 0.95 }}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
      >
        🎯 Kiểm tra từ khóa dọc
      </motion.button>

      {/* Custom Popup */}
      {currentRowIndex !== null && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={handleClosePopup}
          />
          
          {/* Popup Content */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div 
              className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-auto pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header với nút đóng */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-red-900">
                  💡 Câu hỏi {currentRowIndex + 1}
                </h3>
                <button
                  onClick={handleClosePopup}
                  className="text-red-900 hover:text-red-700 text-5xl font-bold leading-none w-12 h-12 flex items-center justify-center hover:bg-red-200 rounded-full transition-all"
                  aria-label="Đóng"
                >
                  ×
                </button>
              </div>

              {/* Hình ảnh */}
              <div className="w-full h-48 rounded-xl overflow-hidden mb-4 shadow-lg">
                <img
                  src={words[currentRowIndex].image}
                  alt={`Gợi ý ${currentRowIndex + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Nút và gợi ý */}
              <div className="mb-4">
                {!showHintText ? (
                  <button
                    onClick={() => setShowHintText(true)}
                    className="w-full px-4 py-3 bg-red-900 text-yellow-300 font-bold rounded-lg hover:bg-red-800 transition"
                  >
                    🔍 Xem gợi ý câu hỏi
                  </button>
                ) : (
                  <div className="text-red-900 text-lg font-medium bg-white/90 p-4 rounded-lg">
                    {words[currentRowIndex].hint}
                  </div>
                )}
              </div>

              {/* Số chữ cái */}
              <div className="mb-3 text-center">
                <span className="inline-block bg-red-900 text-yellow-300 px-4 py-2 rounded-full font-bold">
                  {words[currentRowIndex].text.length} chữ cái
                </span>
              </div>

              {/* Ô nhập */}
              <div className="bg-white/90 p-4 rounded-xl">
                <p className="text-red-900 font-bold mb-3 text-center">Nhập câu trả lời:</p>
                <div className="flex items-center gap-1 justify-center flex-wrap mb-4">
                  {Array.from(words[currentRowIndex].text).map((_, cIdx) => (
                    <input
                      key={cIdx}
                      ref={(el) => {
                        popupInputRefs.current[cIdx] = el;
                      }}
                      maxLength={1}
                      value={userInput[currentRowIndex][cIdx]}
                      onChange={(e) => handlePopupChange(currentRowIndex, cIdx, e.target.value)}
                      onKeyDown={(e) => handlePopupKeyDown(currentRowIndex, cIdx, e)}
                      autoFocus={cIdx === 0}
                      className={`w-10 h-10 text-center font-bold uppercase border-2 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-red-500
                        ${
                          cIdx === words[currentRowIndex].letterIndex
                            ? "bg-yellow-300 border-yellow-600 text-red-800 shadow-lg"
                            : "bg-white border-gray-400 text-red-900"
                        }
                        ${
                          rowStatus[currentRowIndex] === "correct"
                            ? "bg-green-300 border-green-600 text-green-900"
                            : rowStatus[currentRowIndex] === "wrong"
                            ? "bg-red-200 border-red-500 text-red-900"
                            : ""
                        }`}
                    />
                  ))}
                </div>

                {/* Nút action */}
                <div className="flex gap-2">
                  <button
                    onClick={checkPopupRow}
                    className="flex-1 px-6 py-3 bg-red-900 text-yellow-300 font-bold text-lg rounded-lg hover:bg-red-800 transition active:scale-95"
                  >
                    ✓ Kiểm tra
                  </button>
                  <button
                    onClick={handleClosePopup}
                    className="px-6 py-3 bg-gray-700 text-white font-bold text-lg rounded-lg hover:bg-gray-600 transition active:scale-95"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false})}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSnack({ ...snack, open: false })} severity={snack.severity} variant="filled">
          {snack.message}
        </Alert>
      </Snackbar>
    </div>
  );
}