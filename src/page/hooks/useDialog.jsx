import { useState, useCallback, useRef } from "react";

/**
 * useDialog — replaces alert(), window.confirm(), and window.prompt()
 * with promise-based custom modal dialogs.
 *
 * Returns:
 *   - dialog: state object for <DialogRenderer />
 *   - notify(message, type)         → replaces alert()
 *   - confirm(message, options)     → replaces window.confirm(), returns Promise<boolean>
 *   - prompt(message, options)      → replaces window.prompt(), returns Promise<string|null>
 */
export function useDialog() {
  const [dialog, setDialog] = useState({ open: false });
  const resolverRef = useRef(null);

  const closeDialog = useCallback(() => {
    setDialog({ open: false });
    resolverRef.current = null;
  }, []);

  // Simple notification — no response needed (replaces alert)
  const notify = useCallback((message, type = "info") => {
    return new Promise((resolve) => {
      setDialog({ open: true, kind: "notify", message, type });
      resolverRef.current = () => { closeDialog(); resolve(); };
    });
  }, [closeDialog]);

  // Yes/No dialog — returns Promise<boolean> (replaces window.confirm)
  const confirm = useCallback((message, { confirmLabel = "Confirm", cancelLabel = "Cancel", type = "warning", detail = null } = {}) => {
    return new Promise((resolve) => {
      setDialog({ open: true, kind: "confirm", message, detail, type, confirmLabel, cancelLabel });
      resolverRef.current = (result) => { closeDialog(); resolve(result); };
    });
  }, [closeDialog]);

  // Text input dialog — returns Promise<string|null> (replaces window.prompt)
  const prompt = useCallback((message, { placeholder = "", confirmLabel = "Submit", cancelLabel = "Cancel", type = "info" } = {}) => {
    return new Promise((resolve) => {
      setDialog({ open: true, kind: "prompt", message, placeholder, type, confirmLabel, cancelLabel, inputValue: "" });
      resolverRef.current = (result) => { closeDialog(); resolve(result); };
    });
  }, [closeDialog]);

  const handleConfirm = useCallback((inputValue) => {
    if (resolverRef.current) resolverRef.current(inputValue !== undefined ? inputValue : true);
  }, []);

  const handleCancel = useCallback(() => {
    if (resolverRef.current) resolverRef.current(dialog.kind === "prompt" ? null : false);
  }, [dialog.kind]);

  return { dialog, notify, confirm, prompt, handleConfirm, handleCancel };
}
