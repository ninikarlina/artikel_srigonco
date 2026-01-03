'use client';

import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Fragment, ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-2xl transform overflow-hidden rounded-lg border-2 border-gray-300 bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <DialogTitle as="h3" className="text-2xl font-bold text-gray-900">
                    {title}
                  </DialogTitle>
                  <button
                    type="button"
                    className="rounded-md border-2 border-gray-300 p-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
                {children}
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
