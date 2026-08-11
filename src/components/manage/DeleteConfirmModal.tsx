"use client";

import { useRef } from "react";
import { Modal } from "@parkerburgess/wandering-parker-ui";

interface Props {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmModal({ message, onConfirm, onCancel }: Props) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  // #region Tailwind utility consts
  const messageCls = "text-neutral-800 mb-6";
  const actionsRowCls = "flex gap-3 justify-end";
  const cancelBtnCls =
    "px-4 py-2 text-sm border border-neutral-300 rounded hover:bg-neutral-100";
  const deleteBtnCls =
    "px-4 py-2 text-sm bg-incorrect-600 text-white rounded hover:bg-incorrect-700";
  // #endregion

  return (
    <Modal
      onClose={onCancel}
      closeOnBackdropClick={false}
      initialFocusRef={cancelRef}
      ariaLabel="Confirm deletion"
    >
      <p className={messageCls}>{message}</p>
      <div className={actionsRowCls}>
        <button ref={cancelRef} onClick={onCancel} className={cancelBtnCls}>
          Cancel
        </button>
        <button onClick={onConfirm} className={deleteBtnCls}>
          Delete
        </button>
      </div>
    </Modal>
  );
}
