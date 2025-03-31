import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const backdrop = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modal = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 260, damping: 20 } },
};

export default function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdrop}
        >
          <motion.div
            className="bg-white p-6 rounded-xl shadow-xl w-80"
            variants={modal}
          >
            <h2 className="text-lg font-bold mb-3">{title}</h2>
            <p className="text-sm text-gray-700 mb-4">{message}</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={onConfirm}>Confirm</Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

