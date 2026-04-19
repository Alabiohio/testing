"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  type?: "info" | "success" | "warning" | "danger";
  isLoading?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone. Please confirm to proceed.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "info",
  isLoading = false,
}) => {
  const getStyles = () => {
    switch (type) {
      case "success":
        return {
          icon: <CheckCircle2 className="w-6 h-6 text-emerald-500" />,
          bg: "bg-emerald-50",
          border: "border-emerald-100",
          button: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200",
        };
      case "warning":
        return {
          icon: <AlertCircle className="w-6 h-6 text-amber-500" />,
          bg: "bg-amber-50",
          border: "border-amber-100",
          button: "bg-amber-600 hover:bg-amber-700 shadow-amber-200",
        };
      case "danger":
        return {
          icon: <AlertCircle className="w-6 h-6 text-rose-500" />,
          bg: "bg-rose-50",
          border: "border-rose-100",
          button: "bg-rose-600 hover:bg-rose-700 shadow-rose-200",
        };
      default:
        return {
          icon: <Info className="w-6 h-6 text-blue-500" />,
          bg: "bg-blue-50",
          border: "border-blue-100",
          button: "bg-blue-600 hover:bg-blue-700 shadow-blue-200",
        };
    }
  };

  const styles = getStyles();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-[4px]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8">
              <div className={`w-14 h-14 ${styles.bg} rounded-2xl flex items-center justify-center mb-6 border ${styles.border}`}>
                {styles.icon}
              </div>

              <h2 className="text-2xl font-black text-gray-900 mb-2 leading-tight">
                {title}
              </h2>
              <p className="text-gray-500 font-medium leading-relaxed">
                {message}
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-4 rounded-2xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all active:scale-[0.98]"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={`flex-1 px-6 py-4 rounded-2xl font-bold text-white transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 ${styles.button}`}
                >
                  {isLoading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    confirmText
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
