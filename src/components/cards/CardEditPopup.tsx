"use client";

import { Modal } from "@parkerburgess/wandering-parker-ui";
import CardForm from "@/components/manage/CardForm";
import type { Card, Category } from "@/types";

interface Props {
  card: Card;
  categories: Category[];
  onSaved: () => void;
  onClose: () => void;
}

export default function CardEditPopup({ card, categories, onSaved, onClose }: Props) {
  // #region Tailwind utility consts
  const headerCls = "flex items-center justify-between p-4 border-b border-neutral-200";
  const titleCls = "font-semibold text-neutral-900";
  const closeBtnCls = "text-neutral-400 hover:text-neutral-600 text-lg leading-none";
  const bodyCls = "p-4";
  // #endregion

  return (
    <Modal onClose={onClose} size="lg" noPadding>
      <div className={headerCls}>
        <h2 className={titleCls}>Edit Card</h2>
        <button onClick={onClose} className={closeBtnCls} aria-label="Close">
          ✕
        </button>
      </div>
      <div className={bodyCls}>
        <CardForm
          categories={categories}
          defaultCategoryId={card.categoryId}
          editCard={card}
          onSaved={onSaved}
          onCancel={onClose}
        />
      </div>
    </Modal>
  );
}
