"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface SavedItem {
    id: string;
    name: string;
    price: string | null;
    originalPrice: string | null;
    rawPrice: number | null;
    rawPriceRange: string | null;
    unit: string;
    category: string;
    desc: string | null;
    img: string | null;
}

interface SavedContextType {
    savedItems: SavedItem[];
    toggleSave: (item: SavedItem) => void;
    isSaved: (id: string) => boolean;
}

const SavedContext = createContext<SavedContextType | null>(null);

const SAVED_STORAGE_KEY = "ccb_farms_saved";

export function SavedProvider({ children }: { children: React.ReactNode }) {
    const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
    const [hydrated, setHydrated] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(SAVED_STORAGE_KEY);
            if (stored) setSavedItems(JSON.parse(stored));
        } catch {}
        setHydrated(true);
    }, []);

    // Persist to localStorage on change
    useEffect(() => {
        if (hydrated) {
            localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(savedItems));
        }
    }, [savedItems, hydrated]);

    const toggleSave = useCallback((item: SavedItem) => {
        setSavedItems(prev => {
            const exists = prev.find(i => i.id === item.id);
            if (exists) {
                return prev.filter(i => i.id !== item.id); // Remove if exists
            }
            return [...prev, item]; // Add if not
        });
    }, []);

    const isSaved = useCallback((id: string) => {
        return savedItems.some(i => i.id === id);
    }, [savedItems]);

    return (
        <SavedContext.Provider value={{ savedItems, toggleSave, isSaved }}>
            {children}
        </SavedContext.Provider>
    );
}

export function useSaved() {
    const ctx = useContext(SavedContext);
    if (!ctx) throw new Error("useSaved must be used within SavedProvider");
    return ctx;
}
