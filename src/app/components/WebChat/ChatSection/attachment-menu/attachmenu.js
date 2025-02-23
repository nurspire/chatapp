"use client"

import { useState, useRef, useEffect } from "react"
import { IoImage, IoVideocam, IoDocument, IoClose } from "react-icons/io5"
import { CldUploadWidget } from "next-cloudinary"
import "./attachmenu.css"

export default function AttachmentMenu({ isOpen, onClose, onFileSelect, attachRef }) {
  const menuRef = useRef(null)

  // Handle click outside to close the menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  // Adjust menu position dynamically
  useEffect(() => {
    if (isOpen && menuRef.current && attachRef.current) {
      const attachRect = attachRef.current.getBoundingClientRect()
      const menuRect = menuRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const viewportWidth = window.innerWidth

      let top = attachRect.top - menuRect.height - 10 // 10px above the icon
      let left = attachRect.left

      // Adjust position if menu goes above the viewport
      if (top < 0) {
        top = attachRect.bottom + 10 // Show below the icon
      }

      // Adjust position if menu goes beyond the right edge
      if (left + menuRect.width > viewportWidth) {
        left = viewportWidth - menuRect.width - 10
      }

      // Adjust position if menu goes beyond the left edge
      if (left < 0) {
        left = 10
      }

      menuRef.current.style.top = `${top}px`
      menuRef.current.style.left = `${left}px`
    }
  }, [isOpen, attachRef])

  const handleCloudinaryUpload = (type) => {
    return (
      <CldUploadWidget
        uploadPreset="chat_app" // Replace with your Cloudinary upload preset
        onSuccess={(result) => {
          const fileUrl = result.info.secure_url
          console.log("Uploaded file URL:", fileUrl) 
          onFileSelect(fileUrl, type) // Pass the file URL and type to the parent component
        }}
        options={{
          maxFiles: 1,
          resourceType: type === "image" ? "image" : type === "video" ? "video" : "raw",
          folder: "your_folder_name", // Replace with your desired folder name
        }}
      >
        {({ open }) => (
          <button className="menu-item" onClick={() => open()}>
            {type === "image" ? (
              <>
                <IoImage className="icon" />
                <span>Picture</span>
              </>
            ) : type === "video" ? (
              <>
                <IoVideocam className="icon" />
                <span>Video</span>
              </>
            ) : (
              <>
                <IoDocument className="icon" />
                <span>Document</span>
              </>
            )}
          </button>
        )}
      </CldUploadWidget>
    )
  }

  if (!isOpen) return null

  return (
    <div className={`attachment-menu ${isOpen ? "open" : ""}`} ref={menuRef}>
      <button className="close-button" onClick={onClose}>
        <IoClose />
      </button>

      <div className="menu-items">
        {handleCloudinaryUpload("image")}
        {handleCloudinaryUpload("video")}
        {handleCloudinaryUpload("document")}
      </div>
    </div>
  )
}