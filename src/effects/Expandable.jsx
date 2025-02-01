
import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "./use-outside-click"; // Pastikan file ini benar


export function ExperienceSection() {
  const [active, setActive] = useState(null);
  const id = useId();
  const ref = useRef(null);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setActive(null);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <>
      <div className="text-center mt-56 py-8">
        <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-200">
          Experience
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-2">
          Discover my journey and achievements in various events and competitions.
        </p>
      </div>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              className="absolute top-2 right-2 lg:hidden bg-white rounded-full h-6 w-6 flex items-center justify-center"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden flex flex-col"
            >
              <motion.div layoutId={`image-${active.title}-${id}`}>
                <img
                  src={active.src}
                  alt={active.title}
                  className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                />
              </motion.div>
              <div>
                <div className="flex justify-between items-start p-4">
                  <div>
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                      className="font-medium text-neutral-700 dark:text-neutral-200 text-base"
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${active.description}-${id}`}
                      className="text-neutral-600 dark:text-neutral-400 text-base"
                    >
                      {active.description}
                    </motion.p>
                  </div>
                </div>
                <div className="pt-4 relative px-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-neutral-600 dark:text-neutral-400 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                  >
                    {typeof active.content === "function"
                      ? active.content()
                      : active.content}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <ul className="max-w-3xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 items-start gap-6">
        {cards.map((card) => (
          <motion.div
            layoutId={`card-${card.title}-${id}`}
            key={card.title}
            onClick={() => setActive(card)}
            className="p-6 shadow-lg hover:shadow-xl bg-white dark:bg-neutral-800 rounded-xl cursor-pointer transition-shadow duration-300"
          >
            <motion.div layoutId={`image-${card.title}-${id}`}>
              <img
                src={card.src}
                alt={card.title}
                className="h-60 w-full rounded-lg object-cover object-top"
              />
            </motion.div>
            <motion.h3
              layoutId={`title-${card.title}-${id}`}
              className="font-semibold text-neutral-800 dark:text-neutral-200 text-center mt-4 text-lg"
            >
              {card.title}
            </motion.h3>
            <motion.p
              layoutId={`description-${card.description}-${id}`}
              className="text-neutral-600 dark:text-neutral-400 text-center mt-2 text-base"
            >
              {card.description}
            </motion.p>
          </motion.div>
        ))}
      </ul>
    </>
  );
}

export const CloseIcon = () => (
  <motion.svg
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0, transition: { duration: 0.05 } }}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4 text-black"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M18 6l-12 12" />
    <path d="M6 6l12 12" />
  </motion.svg>
);

const cards = [
  {
    description: "Staff Logistics and Property",
    title: "Schotival Event",
    src: "",
    content: () => (
      <p>
        Participated as a staff member for logistics and property in the Schotival event, contributing to successful event management and operations.
      </p>
    ),
  },
  {
    description: "Participant",
    title: "Ideanation Competition",
    src: "",
    content: () => (
      <p>
        Represented in the Ideanation competition, showcasing innovative ideas and creative problem-solving skills in a challenging environment.
      </p>
    ),
  },
  {
    description: "Business Plan Participant",
    title: "YED Competition",
    src: "",
    content: () => (
      <p>
        Competed in the YED Business Plan competition, presenting strategic plans and demonstrating entrepreneurial skills.
      </p>
    ),
  },
];
