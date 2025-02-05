import { motion } from "framer-motion";
import roket from "../assets/roket.gif";

const Test = () => {
    return (
        <div className="h-screen bg-gradient-to-br items-end from-teal-500 to-teal-900 flex  overflow-hidden">
            <motion.img
                src={roket}
                alt="Roket"
                className="w-32 h-32  "
                initial={{ x: "-500%", y: "500%", rotate: 0 }}
                animate={{ x: "1000%", y: "-700%", rotate: 0}}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "linear"
                }}
            />
        </div>
    );
};

export default Test;