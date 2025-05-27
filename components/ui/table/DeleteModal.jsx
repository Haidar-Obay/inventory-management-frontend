"use client";

import React from "react";
import { Modal, Button } from "./CustomControls";

export const DeleteModal = ({ isOpen, onConfirm, onCancel }) => {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title="Confirm Deletion">
      <div className="space-y-4">
        <p className="text-gray-600">
          Are you sure you want to delete this item? This action cannot be
          undone.
        </p>
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={onCancel}
            className="border-border"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};
