"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Props = {
    open: boolean;
    onClose: () => void;
    title: string;
    closeLabel?: string;
    children: ReactNode;
};

export default function Modal({ open, onClose, title, closeLabel = "Close", children }: Props) {
    const ref = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = ref.current;
        if (!dialog) return;
        if (open && !dialog.open) dialog.showModal();
        if (!open && dialog.open) dialog.close();
    }, [open]);

    return (
        <dialog
            ref={ref}
            onClose={onClose}
            onClick={(e) => { if (e.target === ref.current) onClose(); }} // click on the backdrop
            className="m-auto w-full max-w-3xl rounded-2xl border border-border bg-card p-0 text-card-foreground shadow-xl backdrop:bg-black/50"
        >
            {/* children only exist while open, so the form starts fresh every time */}
            {open && (
                <div className="max-h-[85vh] overflow-y-auto p-6">
                    <div className="mb-6 flex items-center justify-between gap-4">
                        <h2 className="text-xl font-bold">{title}</h2>
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label={closeLabel}
                            className="inline-flex size-9 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                            ✕
                        </button>
                    </div>
                    {children}
                </div>
            )}
        </dialog>
    );
}