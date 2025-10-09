'use client'

import { useContext, useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { EventContext } from '@/app/(frontend)/calendar/calendar'
import { registerForClassById, checkInToClassById } from '@/app/actions/registerForClassById'

export default function Modal() {
  const { modalData, setModalData } = useContext(EventContext)
  const [open, setOpen] = useState(true)

  const startTime = modalData ? new Date(modalData.start).toLocaleTimeString() : ''
  const endTime = modalData ? new Date(modalData.end).toLocaleTimeString() : ''

  const inProgress =
    new Date(modalData.start).getTime() <= Date.now() &&
    Date.now() <= new Date(modalData.end).getTime()

  const handleClose = () => {
    setOpen(false)
    setModalData(null)
  }
  const handleReserve = async () => {
    await registerForClassById(modalData.id)
    handleClose()
  }
  const handleCheckIn = async () => {
    await checkInToClassById(modalData.id)
    handleClose()
  }

  return (
    <div>
      <Dialog open={open} onClose={handleClose} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                    <ExclamationTriangleIcon aria-hidden="true" className="size-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                      {modalData.text}
                    </DialogTitle>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {startTime} - {endTime}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {!inProgress && <button onClick={handleReserve}>Reserve Class</button>}
                {inProgress && <button onClick={handleCheckIn}>Check In</button>}
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
